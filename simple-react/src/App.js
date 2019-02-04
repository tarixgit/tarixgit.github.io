import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

const d3 = require('d3');

class App extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            counter: 0,
            width: 960,
            height: 500,
            radius: 18,
            numberOfInputNeuron: 8,
            numberOfOutputNeuron: 8,
            hiddenLayers: 1
        };
        this.updateChart = this.updateChart.bind(this);
    }

    updateChart() {
        // Define the div for the tooltip
        const mschubY = 40;
        const schubX = 240;
        const firstXCoordinate = 60;
        let ipnutData = [];
        let outputData = [];
        let hiddenLayerData = [];
        //Daten vorbereiten
        for (let i = 1; i <= this.state.numberOfInputNeuron; i++) {
            ipnutData.push({
                x: firstXCoordinate,
                y: i * mschubY
            })
        }
        for (let i = 1; i <= this.state.numberOfOutputNeuron; i++) {
            outputData.push({
                x: firstXCoordinate + ((this.state.hiddenLayers + 1) * schubX),
                y: i * mschubY
            })
        }

        for (let i = 1; i <= this.state.hiddenLayers; i++) {
            const currentLayer = [];
            for (let j = 1; j <= this.state.numberOfInputNeuron; j++) {
                currentLayer.push({
                    x: firstXCoordinate + (i * schubX),
                    y: j * mschubY
                })
            }
            hiddenLayerData.push(currentLayer);
        }
        const div = d3.select(this.refVis).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const svg = d3.select(this.viz).append('svg');
        //input layer
        svg.append("g")
            .selectAll("circle")
            .data(ipnutData)
            .enter()
            .append("circle")
            .attr("r", this.state.radius)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .on('mouseover', (d) => {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html('hi' + "<br/>" + d)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 18) + "px");
            }).on('mouseout', (d) => {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        hiddenLayerData.forEach(currentLayer => {
            svg.append("g")
                .selectAll("circle")
                .data(currentLayer)
                .enter()
                .append("circle")
                .attr("r", this.state.radius)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .on('mouseover', (d) => {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html('hi' + "<br/>" + d)
                        .style("left", (d3.event.pageX + 10) + "px")
                        .style("top", (d3.event.pageY - 18) + "px");
                }).on('mouseout', (d) => {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        });
        // output layer
        svg.append("g")
            .selectAll("circle")
            .data(outputData)
            .enter()
            .append("circle")
            .attr("r", this.state.radius)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .on('mouseover', (d) => {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html('hi' + "<br/>" + d)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 18) + "px");
            }).on('mouseout', (d) => {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        Visualisation of neural network
                    </p>
                </header>
                <div className='d3body'>
                    <div ref={refVis => (this.refVis = refVis)}>
                        <svg ref={viz => (this.viz = viz)}
                             width={this.state.width} height={this.state.height}/>
                    </div>
                </div>
                <button onClick={this.updateChart}>update</button>
            </div>
        );
    }
}

export default App;
