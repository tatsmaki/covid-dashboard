class Graph {
    constructor(world) {
        this.world = world;
        console.log('create chart')
    }

    displayChart() {
        this.chart = document.createElement('div');
        this.chart.classList.add('chart');
        return this.chart;
    }

    renderChart(countryData) {
        
    }
}

export default Graph;
