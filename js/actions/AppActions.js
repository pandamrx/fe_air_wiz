import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';

class AppActionsClass {

    loadCountries(){
        AppDispatcher.dispatch({
            action: {
                type: AppConstants.LOAD_COUNTRIES
            }
        });
    }

    loadCitiesByCountryCode(code){
        AppDispatcher.dispatch({
            action: {
                type: AppConstants.LOAD_CITIES
            },
            country_code: code
        });
    }

    loadAirportsByCity(city_name, country_code){
        AppDispatcher.dispatch({
            action: {
                type: AppConstants.LOAD_AIRPORTS
            },
            city_name: city_name,
            country_code: country_code
        });
    }

    loadAirportData(airport_code, search_data) {
        AppDispatcher.dispatch({
            action: {
                type: AppConstants.SEARCH_BY_AIRPORT
            },
            airport_code: airport_code,
            search_data: search_data
        });
    }

    searchCountry(part_name) {
        AppDispatcher.dispatch({
            action: {
                type: AppConstants.TYPE_COUNTRY
            },
            part_name: part_name
        });
    }

    searchCity(part_name) {
        AppDispatcher.dispatch({
            action: {
                type: AppConstants.TYPE_CITY
            },
            part_name: part_name
        });
    }

    searchAirport(part_name) {
        AppDispatcher.dispatch({
            action: {
                type: AppConstants.TYPE_AIRPORT
            },
            part_name: part_name
        });
    }

    loadFlightData(flight, search_data) {
        AppDispatcher.dispatch({
            action: {
                type: AppConstants.SEARCH_BY_FLIGHT
            },
            search_data: search_data,
            flight: flight
        });
    }

    searchFromSubmit() {
        AppDispatcher.dispatch({
            action: {
                type: AppConstants.SUBMIT_SEARCH_FORM
            }
        });
    }
}

export default new AppActionsClass();