import React, {Component} from 'react';
import Slider from '@material-ui/lab/Slider';
import { withStyles } from '@material-ui/core/styles';
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
            height: 400,
            radius: 18,
            numberOfInputNeuron: 8,
            numberOfOutputNeuron: 8,
            hiddenLayers: 1,
            selectedStep: 0
        };
//        this.updateChart = this.updateChart.bind(this);
    }
    onSliderChange = (x) => {
        this.setState({selectedStep: x})
        return;
    }
    updateChart = () => {
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
        hiddenLayerData.push(ipnutData);
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
        hiddenLayerData.push(outputData);
        const div = d3.select(this.refVis).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const svg = d3.select(this.viz).append('svg');
        hiddenLayerData.forEach((currentLayer, layerIndex) => {
            svg.append("g")
                .selectAll("circle")
                .data(currentLayer)
                .enter()
                .append("circle")
                .attr("r", this.state.radius)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .on('mouseover', d => {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html('Layer' + layerIndex + "<br/>" + d.x)
                        .style("left", (d3.event.pageX + 10) + "px")
                        .style("top", (d3.event.pageY - 18) + "px");
                }).on('mouseout', d => {
                    div.transition()
                     .duration(500)
                     .style("opacity", 0);
                });
        });
        hiddenLayerData.forEach((currentLayer, layerIndex) => {
            if (layerIndex == 0) {
                return;
            }
            const accessorLayer = hiddenLayerData[layerIndex - 1];
            const outspace = 1;
            accessorLayer.forEach(accessor => {
                svg.append("g")
                    .selectAll("line")
                    .data(currentLayer)
                    .enter()
                    .append("line")
                    .attr("stroke", "#b9baba")
                    .attr("stroke-width", "2.5")
                    .attr("x1", (d, index) => accessor.x + this.state.radius + outspace)
                    .attr("y1", (d, index) => accessor.y)
                    .attr("x2", d => d.x - this.state.radius - outspace)
                    .attr("y2", d => d.y)

            });
        });
    }

    render() {
        const styles = {
            root: {
                width: 300,
            },
            slider: {
                padding: '22px 0px',
            },
        }
        const {selectedStep} = this.state;
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
                <div className={styles.root}>
                    <Slider
                        classes={{ container: styles.slider }}
                        value={selectedStep}
                        min={0}
                        max={6}
                        step={1}
                        onChange={this.onSliderChange}
                    />
                </div>
            </div>
        );
    }
}

export default App;
//export default withStyles(styles)(StepSlider);
