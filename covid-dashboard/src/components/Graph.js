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
        // type: 'time',
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
    this.flag.width = 400;
    this.flag.height = 200;
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

  setFlag(url) {
    this.svg.src = url;
    this.ctx.drawImage(this.svg, 0, 0, 400, 150);
  }

  renderChart(countryData, status) {
    chartConfig.data.datasets.pop();
    const timestamps = Object.keys(countryData.timeline[status]);
    this.days = Object.values(countryData.timeline[status]);
    this.cutTimeline(timestamps);
    const newCountry = this.updateChart(countryData.country);
    chartConfig.data.datasets.push(newCountry);
    this.chart.update();
  }

  cutTimeline(timestamps) {
    const time = [];
    this.days = this.days.reduceRight((acc, day, i) => {
      // if ((this.days.length - 1 - i) % 5 === 0 || this.days.length === i - 1) {
      acc.push(day);
      time.push(timestamps[i]);
      // }
      return acc;
    }, []);
    return time;
  }

  updateChart(labelName) {
    let fillPattern;
    if (this.svg.src) {
      fillPattern = this.ctx.createPattern(this.flag, 'no-repeat');
    } else {
      fillPattern = '#128533';
    }
    return {
      label: labelName,
      data: this.days.reverse(),
      backgroundColor: fillPattern,
      borderColor: '#000000',
      borderWidth: 1,
      pointRadius: 0,
    };
  }
}

export default Graph;
