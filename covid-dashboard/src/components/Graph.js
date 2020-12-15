import Chart from 'chart.js';

const chartConfig = {
  type: 'line',
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    devicePixelRatio: 2,
    scales: {
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
    console.log('create chart');
  }

  displayChart() {
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('canvas');

    this.chart = new Chart(this.canvas, chartConfig);
    this.initChart();

    return this.canvas;
  }

  initChart() {
    const timestamps = [];
    for (const time in this.world.cases) {
      timestamps.push(time);
    }
    this.days = Object.values(this.world.cases);

    const time = [];
    this.days = this.days.reduceRight((acc, day, i) => {
      if ((this.days.length - 1 - i) % 15 === 0 || this.days.length === i - 1) {
        acc.push(day);
        time.push(timestamps[i]);
      }
      return acc;
    }, []);

    chartConfig.data.labels = time.reverse();

    const newCountry = {
      label: 'World',
      data: this.days.reverse(),
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      borderWidth: 1,
      fill: false,
    };

    chartConfig.data.datasets.push(newCountry);
    this.chart.update();
  }

  renderChart(countryData, status) {
    chartConfig.data.datasets.pop();

    const timestamps = [];
    for (const time in countryData.timeline[status]) {
      timestamps.push(time);
    }
    this.days = Object.values(countryData.timeline[status]);

    const time = [];
    this.days = this.days.reduceRight((acc, day, i) => {
      if ((this.days.length - 1 - i) % 15 === 0 || this.days.length === i - 1) {
        acc.push(day);
        time.push(timestamps[i]);
      }
      return acc;
    }, []);

    const newCountry = {
      label: countryData.country,
      data: this.days.reverse(),
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      borderWidth: 1,
      fill: false,
    };

    chartConfig.data.datasets.push(newCountry);

    this.chart.update();
  }
}

export default Graph;
