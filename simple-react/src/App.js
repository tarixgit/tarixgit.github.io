import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

const d3 = require('d3');

class App extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = { counter: 0 };
        this.updateChart = this.updateChart.bind(this);
    }

    updateChart() {
        // Define the div for the tooltip
        const div = d3.select(this.refVis).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const svg = d3.select(this.viz).append('svg');
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 10)
            .attr("cx", 50)
            .attr("cy", (d) => {
                return d * 25;
            }).on('mouseover', (d) => {
            console.log('tar');
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
        svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 10)
            .attr("cx", 200)
            .attr("cy", (d) => {
                return d * 25;
            }).on('mouseover', (d) => {
            console.log('tar');
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
        svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 10)
            .attr("cx", 350)
            .attr("cy", (d) => {
                return d * 25;
            }).on('mouseover', (d) => {
            console.log('tar');
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
                    <div ref={refVis => (this.refVis = refVis)}>
                        <svg ref={viz => (this.viz = viz)}
                             width={600} height={400}/>
                    </div>
                    <button onClick={this.updateChart}>update</button>
                </header>
            </div>
        );
    }
}

export default App;
