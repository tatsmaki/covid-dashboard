import * as apiHelp from '../helpers/apiHelp';

class ApiCall {
  constructor() {
    this.countriesData = [];
    this.summaryData = {};
  }

  async requestSummary(retryCount = 0) {
    await fetch('https://api.covid19api.com/summary')
      .then(apiHelp.checkStatus)
      .then(apiHelp.toJson)
      .then((data) => this.sortData(data))
      .catch(async (error) => {
        await apiHelp.timeout();
        if (retryCount < 5) {
          await this.requestSummary(retryCount + 1);
        } else {
          this.displayError(error);
        }
      });
  }

  async requestCountry(url, retryCount = 0) {
    await fetch(`https://api.covid19api.com/total/country/${url}`)
      .then(apiHelp.checkStatus)
      .then(apiHelp.toJson)
      .then((data) => {
        this[`${url}`.table] = data;
      })
      .catch(async (error) => {
        await apiHelp.timeout();
        if (retryCount < 5) {
          await this.requestCountry(url, retryCount + 1);
        } else {
          this.displayError(error);
        }
      });
  }

  async requestWorldData(retryCount = 0) {
    await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=300')
      .then(apiHelp.checkStatus)
      .then(apiHelp.toJson)
      .then((data) => {
        this.worldData = data;
      })
      .catch(async (error) => {
        await apiHelp.timeout();
        if (retryCount < 5) {
          await this.requestWorld(retryCount + 1);
        } else {
          this.displayError(error);
        }
      });
  }

  async requestCountryTimeline(url, retryCount = 0) {
    await fetch(`https://disease.sh/v3/covid-19/historical/${url}?lastdays=300`)
      .then(apiHelp.checkStatus)
      .then(apiHelp.toJson)
      .then((data) => {
        this[`${url}`.chart] = data;
      })
      .catch(async (error) => {
        await apiHelp.timeout();
        if (retryCount < 5) {
          await this.requestCountryTimeline(url, retryCount + 1);
        } else {
          this.displayError(error);
        }
      });
  }

  sortData(data) {
    data.Countries.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
    this.summaryData = data;
  }

  displayError(error) {
    this.error = error;
  }
}

export default ApiCall;
