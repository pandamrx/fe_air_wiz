class ConfigsClass {
    constructor(urls){
        this.urls = urls;
    }
}

const Configs = new ConfigsClass({
    countries: 'http://46.101.138.5//api/suggest/countries',
    cities_by_country: 'http://46.101.138.5/api/suggest/cities/',
    airports_by_city: 'http://46.101.138.5/api/suggest/airports/',
    search_by_airport: 'http://46.101.138.5/api/search/airport/',
    search_by_flight: 'http://46.101.138.5/api/search/flight/',
    search: 'http://46.101.138.5/api/search/'
});

export default Configs;

