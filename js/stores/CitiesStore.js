import EventEmitter from 'events';
import request from 'superagent';

import AppDispatcher from '../dispatcher/AppDispatcher.js';
import Configs from '../configs';
import AppConstants from '../constants/AppConstants';

let _store = [], _original_store = [];

let _current_country_code = '';

const CHANGE_EVENT = 'change';
const SEARCH_EVENT = 'search';

class CityStoreClass extends EventEmitter {

    addChangeListener(cb) {
        this.on(CHANGE_EVENT, cb);
    }

    addSearchListener(cb) {
        this.on(SEARCH_EVENT, cb);
    }

    removeChangeListener(cb) {
        this.removeListener(CHANGE_EVENT, cb);
    }

    loadCitiesByCountryCode(code){
        let url = Configs.urls.cities_by_country + code;
        request.get(url)
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) return console.error(err);
                _store = response.body;
                _original_store = response.body;
                _current_country_code = code;
                this.emit(CHANGE_EVENT);
            });
    }

    getList() {
        return _store;
    }

    getAllOptions() {
        return _original_store
    }

    getCurrentCountryCode() {
        return _current_country_code;
    }

    searchCity(part_name){
        let search_results = [];
        if(part_name.length > 1){
            for(let i = 0; i < _original_store.length; i++) {
                let value = _original_store[i].toLowerCase(),
                    str_part = part_name.toLowerCase();
                if(value.includes(str_part)) {
                    search_results.push(_original_store[i]);
                }

            }
        }
        _store = search_results;
        this.emit(SEARCH_EVENT);
    }
}

const CityStore = new CityStoreClass();

AppDispatcher.register((payload) => {
    const action = payload.action;

    switch (action.type) {

        case AppConstants.LOAD_CITIES:
            CityStore.loadCitiesByCountryCode(payload.country_code);
            break;

        case AppConstants.TYPE_CITY:
            CityStore.searchCity(payload.part_name);
            break;

        default:
            return true;
    }

});

export default CityStore;