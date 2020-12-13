// const axios = require('axios').default;

class ApiCall {
    constructor() {
        this.countriesData = [];
        this.summaryData = {};
    }

    async requestData(url, retryCount) {
        await fetch(`https://api.covid19api.com/${url}`)
        // await axios.get(`https://api.covid19api.com/${url}`)
        .then(this.checkStatus)
        .then(this.toJson)
        .then(data => this.sortByDescend(data, url))
        .catch(error => retryCount < 20 ? this.requestData(url, retryCount + 1) : this.displayError(error));
    }

    async requestCountry(url, retryCount) {
        await fetch(`https://api.covid19api.com/total/country/${url}`)
        .then(this.checkStatus)
        .then(this.toJson)
        .then(data => this[url] = data)
        .catch(error => retryCount < 20 ? this.requestCountry(url, retryCount + 1) : this.displayError(error));
    }

    checkStatus(response) {
        if (response.ok) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.status));
        }
    }

    toJson(response) {
        return response.json();
    }

    sortByDescend(data, url) {
        if (url === 'summary') {
            data.Countries.sort((a, b) => {
                return b.TotalConfirmed - a.TotalConfirmed;
            });
            this.summaryData = data;
        } else {
            data.sort((a, b) => {
                return b.TotalConfirmed - a.TotalConfirmed;
            });
            this.worldData = data;
        }
        console.log(data)
    }

    displayError(error) {
        console.log(error);
    }
}

export default ApiCall;
