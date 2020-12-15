class ApiCall {
  constructor() {
    this.countriesData = [];
    this.summaryData = {};
  }

  timeout() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async requestSummary(retryCount = 0) {
    await fetch('https://api.covid19api.com/summary')
      .then(this.checkStatus)
      .then(this.toJson)
      .then((data) => this.sortData(data))
      .catch(async (error) => {
        await this.timeout();
        retryCount < 5
          ? await this.requestSummary(retryCount + 1)
          : this.displayError(error);
      });
  }

  async requestCountry(url, retryCount = 0) {
    await fetch(`https://api.covid19api.com/total/country/${url}`)
      .then(this.checkStatus)
      .then(this.toJson)
      .then((data) => this[`${url}`.table] = data)
      .catch(async (error) => {
        await this.timeout();
        retryCount < 5
          ? await this.requestCountry(url, retryCount + 1)
          : this.displayError(error);
      });
  }

  async requestWorldData(retryCount = 0) {
    await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=300')
      .then(this.checkStatus)
      .then(this.toJson)
      .then((data) => this.worldData = data)
      .catch(async (error) => {
        await this.timeout();
        retryCount < 5
          ? await this.requestWorldData(retryCount + 1)
          : this.displayError(error);
      });
  }

  async requestCountryTimeline(url, retryCount = 0) {
    await fetch(`https://disease.sh/v3/covid-19/historical/${url}?lastdays=300`)
      .then(this.checkStatus)
      .then(this.toJson)
      .then((data) => this[`${url}`.chart] = data)
      .catch(async (error) => {
        await this.timeout();
        retryCount < 5
          ? await this.requestCountryTimeline(url, retryCount + 1)
          : this.displayError(error);
      });
  }

  checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response);
    }
    return Promise.reject(new Error(response.status));
  }

  toJson(response) {
    return response.json();
  }

  sortData(data) {
    data.Countries.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
    this.summaryData = data;
    console.log(data);
  }

  displayError(error) {
    console.log(error);
  }
}

export default ApiCall;
