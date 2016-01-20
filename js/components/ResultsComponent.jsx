import React from 'react';

import CapacityStore from '../stores/CapacityStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';

class ResultsItem extends React.Component {

    render(){
        let item = this.props.item;
        return(
            <div className="results-item">
                <div className="results-item-terminal">{item.terminal}</div>
                <div className="results-item-hourly-load">{item.hourly_load}</div>
            </div>
        );
    }
}

class ResultsByFlightItem extends React.Component {

    constructor(props) {
        super(props);
        this.convertAMPMto24Hours = this.convertAMPMto24Hours.bind(this);
    }

    render(){
        let item = this.props.item;
        if(item.terminal == "unknown") {
            item.terminal = '';
        }
        item.direction = item.direction[0].toUpperCase() + item.direction.slice(1);
        item.time = this.convertAMPMto24Hours(item.hour);
        return(
            <div className="results-item results-item-by-flight">
                <div className="results-item-direction">{item.direction} from {item.airport} at {item.time} {item.timezone}</div>
                <div className="results-item-terminal">{item.terminal}</div>
                <div className="results-item-hourly-load">{item.hourly_load[item.hour]}</div>
            </div>
        );
    }

    convertAMPMto24Hours(time) {
        let hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        return hours[(time % 12)] + ":00 " + ((time < 12) ? "AM" : "PM");
    }
}

class ResultsHeader extends React.Component {

    render(){
        return(
            <div className="results-item results-header">
                {(this.props.showDirection) ? <div className="results-item-direction">Departure/Arrival</div> : ''}
                <div className="results-item-terminal">Terminal #</div>
                <div className="results-item-hourly-load">Number of Passengers</div>
            </div>
        );
    }
}

class ResultsFooter extends React.Component {

    render(){
        return(
            <div className="results-item results-footer">
                <div className="results-item-direction"></div>
                <div className="results-item-terminal">Total:</div>
                <div className="results-item-hourly-load">{this.props.total}</div>
            </div>
        );
    }
}

class ResultsComponent extends React.Component {

    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.onChangeAirport = this.onChangeAirport.bind(this);
        this.onChangeFlight = this.onChangeFlight.bind(this);
        this.hideResuls = this.hideResuls.bind(this);

        this.state = {
            data_results: [],
            data_results_by_airport: [],
            data_results_by_flight: [],
            display: false,
            display_by_airport: false,
            display_by_flight: false
        }
    }

    componentDidMount() {
        CapacityStore.addChangeListener(this._onChange);
        CapacityStore.addChangeAirportListener(this.onChangeAirport);
        CapacityStore.addChangeFlightListener(this.onChangeFlight);
        AppDispatcher.register((payload) => {
            const action = payload.action;
            switch (action.type) {
                case AppConstants.SUBMIT_SEARCH_FORM:
                    this.hideResuls();
                    break;

                default:
                    return true;
            }

        });
    }

    render() {
        let results = [],
            search_params = CapacityStore.getSearchParams(),
            total_number = 0,
            display = this.state.display ? 'block' : 'none',
            show_direction = false;
        if(this.state.data_results_by_airport.length > 0 && this.state.display_by_airport) {
            if(typeof(search_params.hour) !== 'undefined') {
                for(let i = 0; i < this.state.data_results_by_airport.length; i++){
                    let item = {
                        terminal: (this.state.data_results_by_airport[i].terminal == "unknown") ? '' : this.state.data_results_by_airport[i].terminal,
                        hourly_load: this.state.data_results_by_airport[i].hourly_load[search_params.hour]
                    };
                    results.push(<ResultsItem item={item} key={i}/>);
                    total_number = total_number + this.state.data_results_by_airport[i].hourly_load[search_params.hour];
                }
            }
        } else if(this.state.data_results_by_flight.length > 0 && this.state.display_by_flight) {
            for(let i = 0; i < this.state.data_results_by_flight.length; i++){
                results.push(<ResultsByFlightItem item={this.state.data_results_by_flight[i]} key={i}/>);
            }
            show_direction = true;
        }


        return(
            <div className={show_direction ? "results-container results-container-direction" : "results-container"} style={{display: display}}>
                <ResultsHeader showDirection={show_direction}/>
                {results}
                {!show_direction ? <ResultsFooter total={total_number} /> : ''}
            </div>
        );
    }

    _onChange() {
        let results = CapacityStore.getResults();
        if(results.length > 0){
            this.setState({data_results: results, display: true});
        }
    }

    onChangeAirport() {
        let results = CapacityStore.getAirportResults();
        if(results.length > 0) {
            this.setState({data_results_by_airport: results, display: true, display_by_airport: true, display_by_flight: false});
        }
    }

    onChangeFlight() {
        let results = CapacityStore.getFlightResultsSorted();
        if(results.length > 0) {
            this.setState({data_results_by_flight: results, display: true, display_by_airport: false, display_by_flight: true});
        }
    }

    hideResuls() {
        this.setState({
            display: false
        });
    }
}

export default ResultsComponent;