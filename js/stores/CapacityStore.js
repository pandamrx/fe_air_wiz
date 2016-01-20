import EventEmitter from 'events';
import request from 'superagent';

import AppDispatcher from '../dispatcher/AppDispatcher.js';
import Configs from '../configs';
import AppConstants from '../constants/AppConstants';

let _store = [];
let _store_by_airport = [];
let _store_by_flight = [];
let _search_params = {};

const CHANGE_EVENT = 'change';
const CHANGE_EVENT_AIRPORT = 'change_airpot';
const CHANGE_EVENT_FLIGHT = 'change_flight';

class CapacityStoreClass extends EventEmitter{

    addChangeListener(cb) {
        this.on(CHANGE_EVENT, cb);
    }

    addChangeAirportListener(cb) {
        this.on(CHANGE_EVENT_AIRPORT, cb);
    }

    addChangeFlightListener(cb) {
        this.on(CHANGE_EVENT_FLIGHT, cb);
    }

    removeChangeListener(cb) {
        this.removeListener(CHANGE_EVENT, cb);
    }

    loadDataByAirport(airport_code, search_data){
        let url = Configs.urls.search_by_airport + airport_code;
        request.post(url, search_data)
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) return console.error(err);
                _store_by_airport = response.body;
                _search_params = search_data;
                _search_params.airport_code = airport_code;
                this.emit(CHANGE_EVENT_AIRPORT);
        });
    }

    loadDataByFlight(flight, search_data){
        let url = Configs.urls.search_by_flight + flight;
        request.post(url, search_data)
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) return console.error(err);
                _store_by_flight = response.body;
                _search_params = search_data;
                _search_params.flight = flight;
                this.emit(CHANGE_EVENT_FLIGHT);
            });
    }

    loadData(airport_code, search_data){

    }

    getResults() {
        return _store;
    }

    getAirportResults() {
        return _store_by_airport;
    }

    getFlightResults() {
        return _store_by_flight;
    }

    getFlightResultsSorted() {
        let sorted_results = [];
        for(let i = 0; i < _store_by_flight.length; i++){
            let item = _store_by_flight[i];
            if(typeof item.error == "undefined") {
                if(item.direction == "departure") {
                    sorted_results.unshift(item);
                } else {
                    sorted_results.push(item);
                }
            }
        }
        return sorted_results;
    }

    getSearchParams() {
        return _search_params;
    }
}

const CapacityStore = new CapacityStoreClass();

AppDispatcher.register((payload) => {
    const action = payload.action;
    switch (action.type) {

        case AppConstants.SEARCH:
            CapacityStore.loadData(payload.airport_code, payload.search_data);
            break;

        case AppConstants.SEARCH_BY_AIRPORT:
            CapacityStore.loadDataByAirport(payload.airport_code, payload.search_data);
            break;

        case AppConstants.SEARCH_BY_FLIGHT:
            CapacityStore.loadDataByFlight(payload.flight, payload.search_data);
            break;

        default:
            return true;
    }

});

export default CapacityStore;