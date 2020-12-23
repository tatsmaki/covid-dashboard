import Chart from 'chart.js';

const chartConfig = {
  type: 'line',
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    devicePixelRatio: 2,
    maintainAspectRatio: true,
    tooltips: {
      intersect: false,
    },
    scales: {
      xAxes: [{
        type: 'time',
        distribution: 'series',
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
      }],
    },
  },
};

class Graph {
  constructor(world) {
    this.world = world;
    this.svg = document.createElement('img');
    this.flag = document.createElement('canvas');
    this.ctx = this.flag.getContext('2d');
  }

  displayChart() {
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('canvas');

    this.chart = new Chart(this.canvas, chartConfig);
    this.initChart();

    return this.canvas;
  }

  initChart() {
    const timestamps = Object.keys(this.world.cases);
    this.days = Object.values(this.world.cases);
    const time = this.cutTimeline(timestamps);
    chartConfig.data.labels = time.reverse();
    const newCountry = this.updateChart('World');
    chartConfig.data.datasets.push(newCountry);
    this.chart.update();
  }

  setFlag(url, code) {
    this.countryCode = code;
    this.svg.src = url;
    const chartComponent = document.querySelector('.canvas');
    this.ctx.canvas.width  = chartComponent.getAttribute('width');
    this.ctx.canvas.height = chartComponent.getAttribute('height');
    this.ctx.drawImage(this.svg, 0, 0, chartComponent.getAttribute('width') / 2, chartComponent.getAttribute('height') / 2);
  }

  setData(data) {
    this.countriesDataObject = data;
  }

  renderChart(countryData, date, status, view) {
    this.currentTimeline = countryData;
    chartConfig.data.datasets.pop();
    let stat = status.toLowerCase();
    if (stat === 'confirmed') stat = 'cases';
    if (this.currentTimeline) {
      const timestamps = Object.keys(this.currentTimeline.timeline[stat]);
      this.days = Object.values(this.currentTimeline.timeline[stat]);
      this.days = this.checkDate(date);
      this.days = this.checkView(view);
      this.cutTimeline(timestamps);
      const newChart = this.updateChart(this.currentTimeline.country);
      chartConfig.data.datasets.push(newChart);
    } else {
      const timestamps = Object.keys(this.world[stat]);
      this.days = Object.values(this.world[stat]);
      this.days = this.checkDate(date);
      this.days = this.checkView(view);
      this.cutTimeline(timestamps);
      const newChart = this.updateChart('World');
      chartConfig.data.datasets.push(newChart);
    }
    this.chart.update();
  }

  checkDate(date) {
    if (date === 'New') {
      this.days = this.days.reduce((acc, cur, i) => {
        if (i > 0) acc.push(cur - this.days[i - 1]);
        return acc;
      }, [0]);
    }
    return this.days;
  }

  checkView(view) {
    let pop;
    if (this.currentTimeline) {
      pop = this.countriesDataObject[this.countryCode].population;
    } else {
      pop = 7827000000;
    }
    if (view.includes('relative')) {
      this.days = this.days.reduce((acc, cur) => {
        acc.push((cur * 1000000) / pop);
        return acc;
      }, []);
    }
    if (view.includes('percentage')) {
      this.days = this.days.reduce((acc, cur) => {
        acc.push(((cur * 100) / pop));
        return acc;
      }, []);
    }
    return this.days;
  }

  cutTimeline(timestamps) {
    const time = [];
    this.days = this.days.reduceRight((acc, day, i) => {
      if (this.days[i - 1] && day < this.days[i - 1]) {
        acc.push(this.days[i - 1]);
      } else {
        acc.push(day);
      }
      time.push(new Date(timestamps[i]));
      return acc;
    }, []);
    return time;
  }

  updateChart(labelName) {
    let fillPattern;
    if (this.svg.src) {
      fillPattern = this.ctx.createPattern(this.flag, 'no-repeat');
    } else {
      fillPattern = '#ABCDEF50';
    }
    return {
      label: labelName,
      data: this.days.reverse(),
      backgroundColor: fillPattern,
      borderColor: '#fff',
      borderDash: [5, 2],
      borderWidth: 2,
      pointRadius: 0,
    };
  }
}

export default Graph;
