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
    this.flag.width = 500;
    this.flag.height = 250;
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
    this.ctx.drawImage(this.svg, 0, 0, 500, 200);
  }

  renderChart(countryData, status) {
    this.currentTimeline = countryData;
    chartConfig.data.datasets.pop();
    const timestamps = Object.keys(countryData.timeline[status]);
    this.days = Object.values(countryData.timeline[status]);
    this.cutTimeline(timestamps);
    const newCountry = this.updateChart(countryData.country);
    chartConfig.data.datasets.push(newCountry);
    this.chart.update();
  }

  changeView(date, status) {
    chartConfig.data.datasets.pop();
    let stat = status.toLowerCase();
    if (stat === 'confirmed') stat = 'cases';
    if (this.currentTimeline) {
      const timestamps = Object.keys(this.currentTimeline.timeline[stat]);
      this.days = Object.values(this.currentTimeline.timeline[stat]);
      this.cutTimeline(timestamps);
      const newChart = this.updateChart(this.currentTimeline.country);
      chartConfig.data.datasets.push(newChart);
    } else {
      const timestamps = Object.keys(this.world[stat]);
      this.days = Object.values(this.world[stat]);
      this.cutTimeline(timestamps);
      const newChart = this.updateChart('World');
      chartConfig.data.datasets.push(newChart);
    }
    this.chart.update();
  }

  cutTimeline(timestamps) {
    const time = [];
    this.days = this.days.reduceRight((acc, day, i) => {
      // if ((this.days.length - 1 - i) % 3 === 0 || this.days.length === i - 1) {
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
