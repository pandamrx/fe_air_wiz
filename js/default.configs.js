class ConfigsClass {
    constructor(urls){
        this.urls = urls;
    }
}

const Configs = new ConfigsClass({
    countries: 'http://localhost:9292/api/suggest/countries',
    cities_by_country: 'http://localhost:9292/api/suggest/cities/',
    airports_by_city: 'http://localhost:9292/api/suggest/airports/',
    search_by_airport: 'http://localhost:9292/api/search/airport/',
    search_by_flight: 'http://localhost:9292/api/search/flight/',
    search: 'http://localhost:9292/api/search/'
});

export default Configs;

