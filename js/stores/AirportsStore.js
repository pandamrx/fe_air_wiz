import EventEmitter from 'events';
import request from 'superagent';

import AppDispatcher from '../dispatcher/AppDispatcher.js';
import Configs from '../configs';
import AppConstants from '../constants/AppConstants';

let _store = {}, _original_store = {};
let _current_city = '';

const CHANGE_EVENT = 'change';
const SEARCH_EVENT = 'search';

class AirportsStoreClass extends EventEmitter{
    addChangeListener(cb) {
        this.on(CHANGE_EVENT, cb);
    }

    addSearchListener(cb) {
        this.on(SEARCH_EVENT, cb);
    }

    removeChangeListener(cb) {
        this.removeListener(CHANGE_EVENT, cb);
    }

    loadAirportsByCity(city, country_code){
        let url = Configs.urls.airports_by_city + country_code + '/' + city;
        request.get(url)
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) return console.error(err);
                _store = response.body;
                _original_store = response.body;
                _current_city = city;
                this.emit(CHANGE_EVENT);
            });
    }

    getList() {
        return _store;
    }

    getCurrentCity() {
        return _current_city;
    }

    searchAirport(part_name){
        let search_results = {};
        for(let i of Object.keys(_original_store)) {
            let key = i.toLowerCase(),
                value = _original_store[i].toLowerCase(),
                str_part = part_name.toLowerCase();
            if(key.includes(str_part) || value.includes(str_part)) {
                search_results[i] = _original_store[i];
            }

        }
        _store = search_results;
        this.emit(SEARCH_EVENT);
    }
}

const AirportsStore = new AirportsStoreClass();

AppDispatcher.register((payload) => {
    const action = payload.action;

    switch (action.type) {

        case AppConstants.LOAD_AIRPORTS:
            AirportsStore.loadAirportsByCity(payload.city_name, payload.country_code);
            break;
        case AppConstants.TYPE_AIRPORT:
            AirportsStore.searchAirport(payload.part_name);

        default:
            return true;
    }

});

export default AirportsStore;