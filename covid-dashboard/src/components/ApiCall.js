import * as apiHelp from '../helpers/apiHelp';
import {
  populationUrl,
  covidSummaryUrl,
  worldTimelineUrl,
  countryTimelineUrl,
  daysInTimeline,
} from '../constants/const';

const fetch = require('node-fetch');

class ApiCall {
  constructor() {
    this.countriesData = [];
    this.summaryData = {};
  }

  async getPopulation(retryCount = 0) {
    await fetch(populationUrl)
      .then(apiHelp.checkStatus)
      .then(apiHelp.toJson)
      .then((data) => {
        this.population = data;
      })
      .catch(async (error) => {
        await apiHelp.timeout();
        if (retryCount < 5) {
          await this.getPopulation(retryCount + 1);
        } else {
          this.displayError(error);
        }
      });
  }

  async requestSummary(retryCount = 0) {
    await fetch(covidSummaryUrl)
      .then(apiHelp.checkStatus)
      .then(apiHelp.toJson)
      .then((data) => {
        this.sortData(data);
      })
      .catch(async (error) => {
        await apiHelp.timeout();
        if (retryCount < 5) {
          await this.requestSummary(retryCount + 1);
        } else {
          this.displayError(error);
        }
      });
  }

  async requestWorldData(retryCount = 0) {
    await fetch(`${worldTimelineUrl}${daysInTimeline}`)
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
    await fetch(`${countryTimelineUrl}${url}${daysInTimeline}`)
      .then(apiHelp.checkStatus)
      .then(apiHelp.toJson)
      .then((data) => {
        this[`${url}chart`] = data;
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
    this.summaryData = data;

    const countriesData = data.Countries.filter((cases) => cases.TotalConfirmed > 27);
    const population = this.population.reduce((acc, cur) => {
      acc[cur.alpha2Code] = {
        code: cur.alpha2Code,
        flag: cur.flag,
        pop: cur.population,
      };
      return acc;
    }, {});

    this.countriesDataObject = countriesData.reduce((acc, cur) => {
      const { pop } = population[cur.CountryCode];
      const { flag } = population[cur.CountryCode];
      acc[cur.CountryCode] = {
        Country: cur.Country,
        CountryCode: cur.CountryCode,
        TotalConfirmed: cur.TotalConfirmed,
        TotalDeaths: cur.TotalDeaths,
        TotalRecovered: cur.TotalRecovered,
        NewConfirmed: cur.NewConfirmed,
        NewDeaths: cur.NewDeaths,
        NewRecovered: cur.NewRecovered,
        population: pop,
        svg: flag,
      };
      return acc;
    }, {});
  }

  displayError(error) {
    this.error = error;
  }
}

export default ApiCall;
