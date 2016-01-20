import React from 'react';

import CountriesStore from '../stores/CountriesStore'
import CityStore from '../stores/CitiesStore';
import AirportsStore from '../stores/AirportsStore';
import CapacityStore from '../stores/CapacityStore';

import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';

import AppActions from '../actions/AppActions';

import DatepickerComponent from './DatepickerComponent.jsx';

class CountryItem extends React.Component {
    render() {

        return(
            <div className="country-item input-options-item" data-code={this.props.code} data-name={this.props.name}
                 onClick={this.props.changeCountry.bind(this)}>
                {this.props.name}
            </div>
        );
    }
}

class CountryComponent extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.onSearchCountry = this.onSearchCountry.bind(this);
        this.changeCountry = this.changeCountry.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.resetComponent = this.resetComponent.bind(this);
        this.showAllOptions = this.showAllOptions.bind(this);

        this.state = {
            countries: {},
            current_country_code: '',
            visible: false,
            selected_country: {}
        };
    }

    componentDidMount() {
        CountriesStore.addChangeListener(this._onChange);
        CountriesStore.addSearchListener(this.onSearchCountry);
        CapacityStore.addChangeAirportListener(this.resetComponent);
        document.addEventListener('click', this.handleClick.bind(this));
    }

    render() {
        let country_options = [],
            display_options = (this.state.visible) ? "block" : "none";
        for(let i of Object.keys(this.state.countries)) {
            country_options.push(<CountryItem code={i} name={this.state.countries[i]} key={i}
                                              changeCountry={this.changeCountry.bind(this)}/>);
        }
        return(
            <div className="input-item">
                <label htmlFor="country">Input Country</label>
                <input type="text" name="country" className="country-input form-input"
                       onInput={this.onTypeCountry.bind(this)} ref={(ci) => this._country_input = ci}
                       onDoubleClick={this.showAllOptions.bind(this)}
                       placeholder="Country" id="country" autoComplete="off"/>
                <div className="country-options input-options" style={{display: display_options}}>{country_options}</div>
            </div>
        );
    }

    changeCountry(event) {
        let country = event.target.dataset;
        this.setState({current_country_code: country.code, visible: false});
        this._country_input.value = country.name;
        AppActions.loadCitiesByCountryCode(country.code);
    }

    _onChange() {
        this.setState({countries: CountriesStore.getList()});
    }

    onTypeCountry(e) {
        AppActions.searchCountry(e.target.value);
    }

    onSearchCountry(e) {
        this.setState({countries: CountriesStore.getList(), visible: true});
    }

    handleClick() {
        this.setState({visible: false});
    }

    resetComponent() {
        this._country_input.value = '';
        /*this.setState({

        });*/
    }

    showAllOptions(e) {
        this.setState({countries: CountriesStore.getAllOptions(), visible: true});
    }
}

class CityItem extends React.Component {

    render(){

        return(
            <div className="city-item input-options-item" data-name={this.props.name} onClick={this.props.changeCity.bind(this)}>
                {this.props.name}
            </div>
        );
    }
}

class CityComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cities: [],
            current_city: '',
            current_country_code: '',
            visible: false,
            disabled: true
        };
        this._onChange = this._onChange.bind(this);
        this.onTypeCity = this.onTypeCity.bind(this);
        this.onSearchCity = this.onSearchCity.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.resetComponent = this.resetComponent.bind(this);
        this.showAllOptions = this.showAllOptions.bind(this);
    }

    componentDidMount() {
        CityStore.addChangeListener(this._onChange);
        CityStore.addSearchListener(this.onSearchCity);
        CapacityStore.addChangeAirportListener(this.resetComponent);
        CountriesStore.addSearchListener(this.resetComponent);
        document.addEventListener('click', this.handleClick.bind(this));
    }

    render(){
        let city_options = [],
            display_options = (this.state.visible) ? "block" : "none";
        for(let i = 0; i < this.state.cities.length; i++) {
            city_options.push(<CityItem name={this.state.cities[i]} key={i} changeCity={this.changeCity.bind(this)} />);
        }
        return(
            <div className="input-item">
                <label htmlFor="city">Input City</label>
                <input type="text" className="city-input form-input" id="city" name="city"
                       onInput={this.onTypeCity.bind(this)} placeholder="City" ref={(ci) => this._city_input = ci}
                       onDoubleClick={this.showAllOptions.bind(this)}
                       disabled={this.state.disabled} autoComplete="off"/>
                <div className="city-options input-options" style={{display: display_options}}>{city_options}</div>
            </div>
        );
    }

    changeCity(event) {
        let city_name = event.target.dataset.name;
        this.setState({current_city: city_name, visible: false});
        this._city_input.value = city_name;
        AppActions.loadAirportsByCity(city_name, this.state.current_country_code);
    }

    _onChange(){
        this.resetComponent();
        this.setState({
            cities: CityStore.getList(),
            current_country_code: CityStore.getCurrentCountryCode(),
            disabled: false
        });
    }

    onTypeCity(e) {
        AppActions.searchCity(e.target.value);
    }

    onSearchCity(e) {
        this.setState({visible: true});
    }

    handleClick() {
        this.setState({visible: false});
    }

    resetComponent() {
        this._city_input.value = '';
        this.setState({
            disabled: true
        });
    }

    showAllOptions(e) {
        this.setState({countries: CityStore.getAllOptions(), visible: true});
    }
}

class AirportItem extends React.Component {

    render(){

        return(
            <div className="airport-item input-options-item" data-code={this.props.code} data-name={this.props.name}
                onClick={this.props.onSelectAirport.bind(this)}>
                {this.props.name}
            </div>
        );
    }
}

class AirportComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            airports: [],
            current_city: '',
            visible: false,
            disabled: true
        };
        this._onChange = this._onChange.bind(this);
        this.onSearchAirport = this.onSearchAirport.bind(this);
        this.onSelectAirport = this.onSelectAirport.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.resetComponent = this.resetComponent.bind(this);
        this.showAllOptions = this.showAllOptions.bind(this);
    }

    componentDidMount() {
        AirportsStore.addChangeListener(this._onChange);
        AirportsStore.addSearchListener(this.onSearchAirport);
        CapacityStore.addChangeAirportListener(this.resetComponent);
        CountriesStore.addSearchListener(this.resetComponent);
        CityStore.addSearchListener(this.resetComponent);
        CityStore.addChangeListener(this.resetComponent);
        document.addEventListener('click', this.handleClick.bind(this));
    }

    render(){
        let airport_options = [],
            display_options = (this.state.visible) ? "block" : "none";
        for(let i of Object.keys(this.state.airports)){
            airport_options.push(<AirportItem code={i} name={this.state.airports[i]}
                                              key={i} onSelectAirport={this.onSelectAirport.bind(this)}/>);
        }
        return(
            <div className="input-item">
                <label htmlFor="airport">Input Airport</label>
                <input type="text" id="airport" name="airport" className="airport-input form-input" placeholder="Airport"
                       onInput={this.onTypeAirport.bind(this)} ref={(ai) => this._airport_input = ai}
                       onDoubleClick={this.showAllOptions.bind(this)}
                       disabled={this.state.disabled} autoComplete="off"/>
                <div className="country-options input-options" style={{display: display_options}}>{airport_options}</div>
            </div>
        );
    }

    _onChange(){
        this.resetComponent();
        this.setState({
            airports: AirportsStore.getList(),
            current_city: AirportsStore.getCurrentCity(),
            disabled: false
        });
    }

    onSelectAirport(e) {
        let airport = e.target.dataset;
        this._airport_input.value = airport.name;
        this.setState({visible: false});
        this.props.onSelectAirport(airport.code);
    }

    onTypeAirport(e) {
        AppActions.searchAirport(e.target.value);
    }

    onSearchAirport(e) {
        this.setState({
            airports: AirportsStore.getList(),
            current_city: AirportsStore.getCurrentCity(),
            visible: true
        });
    }

    handleClick() {
        this.setState({visible: false});
    }

    resetComponent() {
        this._airport_input.value = '';
        this.setState({
            disabled: true
        });
    }

    showAllOptions(e) {
        this.setState({countries: CityStore.getAllOptions(), visible: true});
    }
}

class TabsComponent extends React.Component {

    constructor(props) {
        super(props);
        this.switchTab = this.switchTab.bind(this);
        this.resetFlight = this.resetFlight.bind(this);

        this.state = {
            active_tab: 'by_flight',
            tabs: ['by_airport', 'by_flight']
        }
    }


    componentDidMount() {
        CapacityStore.addChangeFlightListener(this.resetFlight);
    }

    render() {
        let display_tabs = {};
        for(let i = 0; i < this.state.tabs.length; i++) {
            if(this.state.tabs[i] == this.state.active_tab) {
                display_tabs[this.state.tabs[i]] = 'block';
            } else {
                display_tabs[this.state.tabs[i]] = 'none';
            }
        }
        return(
            <div className="tabs-container">
                <div className="tabs-header">
                    <div className={(this.state.active_tab == this.state.tabs[1]) ? "tabs-header-item active" : "tabs-header-item"}
                         id="by-flight" onClick={this.switchTab.bind(this, this.state.tabs[1])}>By Flight</div>
                    <div className={(this.state.active_tab == this.state.tabs[0]) ? "tabs-header-item active" : "tabs-header-item"}
                         id="by-airpot" onClick={this.switchTab.bind(this, this.state.tabs[0])}>By Airport</div>

                </div>
                <div className="tabs-content">
                    <div className="tabs-item" id="by-airport-content" style={{display: display_tabs[this.state.tabs[0]]}}>
                        <CountryComponent />
                        <CityComponent />
                        <AirportComponent onSelectAirport={this.props.onSelectAirport.bind(this)}/>
                    </div>
                    <div className="tabs-item" id="by-flight-content" style={{display: display_tabs[this.state.tabs[1]]}}>
                        <div className="input-item">
                        <label htmlFor="flight">Input Flight</label>
                        <input type="text" id="flight" name="flight" className="flight-input form-input" placeholder="Flight"
                               onInput={this.onTypeFlight.bind(this)} ref={(fi) => this._flight = fi} autoComplete="off"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    onTypeFlight(e) {
        let upper_flight = e.target.value.toUpperCase(),
            flight_ref =  /^[A-Z]{2}(\d+)$/;
        if(upper_flight.match(flight_ref)) {
            this.props.setFlightNumber(upper_flight);
        }
    }

    switchTab(tab) {
        this.setState({
            active_tab: tab
        });
        if (tab == this.state.tabs[0]) {
            AppActions.loadCountries();
        }
        this.props.setActiveTab(tab);
    }

    resetFlight() {

    }
}

class SearchComponent extends React.Component {
    constructor(props) {
        super(props);
        this.setDirection = this.setDirection.bind(this);
        this.searchByAirport = this.searchByAirport.bind(this);
        this.onSelectDate = this.onSelectDate.bind(this);
        this.onSelectAirport = this.onSelectAirport.bind(this);
        this.setFlightNumber = this.setFlightNumber.bind(this);
        this.onTypeHour = this.onTypeHour.bind(this);
        this.setActiveTab = this.setActiveTab.bind(this);
        this.resetHour = this.resetHour.bind(this);
        this.searchByFlight = this.searchByFlight.bind(this);

        let today = new Date();
        this.state = {
            day: today.getDate(),
            month: today.getMonth() + 1,
            year: today.getFullYear(),
            hour: today.getHours(),
            flight: '',
            active_tab: 'by_flight'
        };
    }

    componentDidMount() {
        CapacityStore.addChangeAirportListener(this.resetHour);
    }

    render(){
        let hide_on_flight = (this.state.active_tab == 'by_flight') ? 'none' : 'block';
        return(
            <div className="search-form-container">
                <form action="" className="search-form input-item-container" id="search-form" onSubmit={this.search.bind(this)}>
                    <TabsComponent onSelectAirport={this.onSelectAirport.bind(this)} setDirection={this.setDirection.bind(this)}
                                   setFlightNumber={this.setFlightNumber.bind(this)} ref={(tc) => this._tabs_component = tc }
                                   setActiveTab={this.setActiveTab.bind(this)}/>
                    <div className="static-items-container">
                        <div className="input-item">
                            <label htmlFor="date">Select Date</label>
                            <div className={(hide_on_flight == 'none') ? "date-input-item" : "date-input-item date-input-item-hour"}>
                            <DatepickerComponent onSelect={this.onSelectDate.bind(this)}/>
                            <input type="text" name="hour" id="hour" className="hour-input form-input"
                                   ref={(hi) => this._hour_input = hi }
                                   onInput={this.onTypeHour.bind(this)} placeholder="12 AM" autoComplete="off"
                                   style={{display: hide_on_flight}}/>
                            </div>
                        </div>
                        <div className="input-item" style={{display: hide_on_flight}}>
                            <div>
                                <label className="radio-inline"><input
                                    type="radio"
                                    name="direction"
                                    value="arrival"
                                    onClick={this.setDirection.bind(this)}/> Arrival</label>
                                <label className="radio-inline"><input
                                    type="radio"
                                    name="direction"
                                    value="departure"
                                    onClick={this.setDirection.bind(this)}/> Departure</label>
                            </div>
                        </div>
                        <div className="input-item">
                            <input type="submit" id="search-button" className="search-form-button button" value="Search"/>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    search(event) {
        event.preventDefault();
        AppActions.searchFromSubmit();
        if(this._tabs_component.state.active_tab == this._tabs_component.state.tabs[0]){
            this.searchByAirport();
        }else if(this._tabs_component.state.active_tab == this._tabs_component.state.tabs[1]) {
            this.searchByFlight();
        }

    }

    searchByAirport() {
        if(this.state.direction) {
            AppActions.loadAirportData(this.state.airport, {
                direction: this.state.direction,
                day: this.state.day,
                month: this.state.month,
                year: this.state.year,
                hour: this.state.hour
            });
        }
    }

    searchByFlight() {
        if(this.state.flight) {
            AppActions.loadFlightData(this.state.flight, {
                day: this.state.day,
                month: this.state.month,
                year: this.state.year
            });
            this.setState({
                flight: ''
            })
        }
    }
    
    onSelectAirport(airport) {
        this.setState({
            airport: airport
        });
    }

    setDirection(event){
        this.setState({
            direction: event.target.value
        });
    }

    converAMPMTo24Hour(hour) {
        let hour_24_format = '',
            hour_part = hour.toLowerCase().split(' ');
        if (hour_part[1] == 'am') {
            if(hour_part[0] == '12') {
                hour_24_format = 0;
            } else {
                hour_24_format = hour_part[0];
            }
        } else if (hour_part[1] == 'pm') {
            if(hour_part[0] == '12') {
                hour_24_format = hour_part[0];
            } else {
                hour_24_format = hour_part[0]*1 + 12;
            }
        }

        return hour_24_format;
    }

    onTypeHour(e) {
        let time = e.target.value,
            ampm_format = /^(0?[1-9]|1[012])\s[APap][mM]$/,
            matched_times = [];
        matched_times = time.match(ampm_format);
        if(matched_times) {
            this.setState({
                hour: this.converAMPMTo24Hour(time)
            });
        }

    }

    resetHour() {
        this._hour_input.value = '';
    }

    onSelectDate(time){
        this.setState({
            day: time.getDate(),
            month: time.getMonth() + 1,
            year: time.getFullYear()
        });
    }

    setFlightNumber(flight) {
        this.setState({
            flight: flight
        });
    }

    setActiveTab(tab) {
        this.setState({
            active_tab: tab
        });
    }

}

export {SearchComponent};