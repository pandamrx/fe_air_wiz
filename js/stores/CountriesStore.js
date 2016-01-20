import EventEmitter from 'events';
import request from 'superagent';

import AppDispatcher from '../dispatcher/AppDispatcher.js';
import Configs from '../configs';
import AppConstants from '../constants/AppConstants';

let _store = {}, _original_store = {};

const CHANGE_EVENT = 'change';
const SEARCH_EVENT = 'search';

class CountriesStoreClass extends EventEmitter {
    constructor(props) {
        super(props);
    }

    addChangeListener(cb) {
        this.on(CHANGE_EVENT, cb);
    }

    addSearchListener(cb) {
        this.on(SEARCH_EVENT, cb);
    }

    removeChangeListener(cb) {
        this.removeListener(CHANGE_EVENT, cb);
    }

    loadCountries() {
        if(Object.keys(_original_store).length == 0) {
            request.get(Configs.urls.countries)
                .set('Accept', 'application/json')
                .end((err, response) => {
                    if (err) return console.error(err);
                    _store = response.body;
                    _original_store = response.body;
                    this.emit(CHANGE_EVENT);
                });
        }
    }

    getList() {
        return _store;
    }

    getAllOptions() {
        return _original_store;
    }

    searchCountry(part_name){
        let search_results = {};
        if(part_name.length > 1){
            for(let i of Object.keys(_original_store)) {
                let key = i.toLowerCase(),
                    value = _original_store[i].toLowerCase(),
                    str_part = part_name.toLowerCase();
                if(key.includes(str_part) || value.includes(str_part)) {
                    search_results[i] = _original_store[i];
                }

            }
        }
        _store = search_results;
        this.emit(SEARCH_EVENT);
    }
}

const CountriesStore = new CountriesStoreClass();

AppDispatcher.register((payload) => {
    const action = payload.action;

    switch (action.type) {

        case AppConstants.LOAD_COUNTRIES:
            CountriesStore.loadCountries();
            break;
        case AppConstants.TYPE_COUNTRY:
            CountriesStore.searchCountry(payload.part_name);
        default:
            return true;
    }

});

export default CountriesStore;