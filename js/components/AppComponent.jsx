import React from 'react';
import {SearchComponent} from './SearchComponent.jsx';
import ResultsComponent from './ResultsComponent.jsx';


class AppComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){

        return(
            <div className="components-container">
                <div className="search-component"><SearchComponent /></div>
                <div className="results-component"><ResultsComponent /></div>
            </div>
        );
    }
}

export {AppComponent};