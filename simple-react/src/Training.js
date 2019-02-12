import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { renderToStaticMarkup } from 'react-dom/server'
import {withStyles} from '@material-ui/core/styles';
import './Trainig.css';
import StepperNN from './StepperNN';
import MathJax from 'mathjax';
import Typography from "@material-ui/core/es/Typography/Typography";
const { Provider, Node } = require("@nteract/mathjax");
//const MathJax = require('mathjax');
const d3 = require('d3');
// const {Queue} = MathJax.Hub;
// Queue(["Typeset",MathJax.Hub]);
//MathJax.Hub.Config({tex2jax:{inlineMath:[['$','$'],['\\(','\\)']]}});

const styles = {
    root: {
        width: 300,
    },
    slider: {
        padding: '22px 0px',
    },
    thumbIcon: {
        borderRadius: '50%',
    },
    thumbIconWrapper: {
        backgroundColor: '#fff',
        width: 'auto',
        height: 'auto  '
    },
};

class Training extends Component {
     constructor(props) {
        super(props);
        this.state = {
            counter: 0,
            width: 1200,
            height: 400,
            radius: 18,
            widthOfCell: 20,
            heightOfCell: 20,
            numberOfInputNeuron: 9,
            numberOfOutputNeuron: 9,
            hiddenLayers: 1,
            selectedStep: 0,
            descrOne: String.raw`\overrightarrow{O}`,
            descrTwo: String.raw`W_1`,
            currentStepFormula: this.getStepContent(0),
            currentStep: 0
        };
    }

    componentDidMount(props, state, root) {
        const svg = d3.select(this.viz);
        const svgGraph = svg.append('svg');
        const matrixSvg = svg.append('svg')
            .attr('x', 20)
            .attr('y', 50);
        this.setState({svg, svgGraph, matrixSvg});
        this.updateChart(null, svgGraph);
        // MathJax.Hub.Queue(["Typeset",MathJax.Hub, root]);
    }

    getStepContent = (step) => {
        switch (step) {
            case 0:
                return String.raw`\overrightarrow{O^1} = S(\overrightarrow{O}, W_1)`;
            case 1:
                return String.raw`\overrightarrow{O^2} = S(\overrightarrow{O^1}, W_2)`;
            case 2:
                return String.raw`\overrightarrow{e} = \begin{pmatrix} O^2_1 - t_1 \\ O^2_2 - t_2 \\ \vdots \\ O^2_m - t_m \\ \end{pmatrix}`;
            case 3:
                return String.raw`E = \frac{1}{2}\{(O^2_1 - t_1)^2 + (O^2_2 - t_2)^2 + ... +(O^2_m - t_m)^2\}`;
            case 4:
                return String.raw`D_2 = \begin{pmatrix} O^2_1(1 - O^2_1) & \cdots & \cdots \\ \cdots & O^2_2(1 - O^2_2) & \cdots \\ \cdots & \cdots & O^2_m(1 - O^2_m)\\ \end{pmatrix}`;
            case 5:
                return String.raw`D_1 = \begin{pmatrix} O^1_1(1 - O^1_1) & \cdots & \cdots \\ \cdots & O^1_2(1 - O^2_2) & \cdots \\ \cdots & \cdots & O^1_k(1 - O^1_k)\\ \end{pmatrix}`;
            case 6:
                return String.raw`\overrightarrow{\delta^2} = D_2 * \overrightarrow{e}`;
            case 7:
                return String.raw`\overrightarrow{\delta^1} = D_1 * W_2 * \overrightarrow{e}`;
            case 8:
                return String.raw`\overrightarrow{\Delta w_2^T} = - \gamma * \overrightarrow{\delta^2}`;
            case 9:
                return String.raw`\overrightarrow{\Delta w_1^T} = - \gamma * \overrightarrow{\delta^1}`;
            default:
                return 'learning rate step';
        }
    };

    setStepDescription = (currentStep) => {
        const currentStepFormula = this.getStepContent(currentStep);
        this.setState({
            currentStepFormula,
            currentStep
        });
    };

    onSliderChange = (event, selectedStep) => {
        this.setState({selectedStep});
        return;
    };

    updateChart = (e, svgNew) => {
        // Define the div for the tooltip
        const mschubY = 40;
        const schubX = 300;
        const firstXCoordinate = 450;
        const svgGraph = svgNew ? svgNew : this.state.svg;
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

        //draw the tooltip
        const div = d3.select(this.refVis).append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        //draw the circles
        hiddenLayerData.forEach((currentLayer, layerIndex) => {
            svgGraph.append('g')
                .selectAll('circle')
                .data(currentLayer)
                .enter()
                .append('circle')
                .attr('r', this.state.radius)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('stroke', 'black')
                .style("stroke-width", 2)
                // .style("stroke-opacity", 1)
                .style('fill', '#47BA36')
                .on('mouseover', d => {
                    div.transition()
                        .duration(200)
                        .style('opacity', .9);
                    div.html('Layer' + layerIndex + '<br/>' + d.x)
                        .style('left', (d3.event.pageX + 10) + 'px')
                        .style('top', (d3.event.pageY - 18) + 'px');
                }).on('mouseout', d => {
                div.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
        });

        //draw the lines
        hiddenLayerData.forEach((currentLayer, layerIndex) => {
            if (layerIndex == 0) {
                return;
            }
            const accessorLayer = hiddenLayerData[layerIndex - 1];
            const outspace = 3;
            accessorLayer.forEach(accessor => {
                svgGraph.append('g')
                    .selectAll('line')
                    .data(currentLayer)
                    .enter()
                    .append('line')
                    .attr('stroke', '#b9baba')
                    .attr('stroke-width', '2.5')
                    .attr('x1', (d, index) => accessor.x + this.state.radius + outspace)
                    .attr('y1', (d, index) => accessor.y)
                    .attr('x2', d => d.x - this.state.radius - outspace)
                    .attr('y2', d => d.y)

            });
        });
    };

    prepareMatrixData = (matrixRows, matrixColumns) => {
        const data = [];
        let xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
        let ypos = 1;
        const width = this.state.widthOfCell;
        const height = this.state.heightOfCell;
        const click = 0;

        // iterate for rows
        for (let row = 0; row < matrixRows; row++) {
            data.push([]);

            // iterate for cells/columns inside rows
            for (let column = 0; column < matrixColumns; column++) {
                data[row].push({
                    x: xpos,
                    y: ypos,
                    width: width,
                    height: height,
                    click: click,
                    value: 0.1
                });
                // increment the x position. I.e. move it over by 50 (width variable)
                xpos += width;
            }
            // reset the x position after a row is complete
            xpos = 1;
            // increment the y position for the next row. Move it down 50 (height variable)
            ypos += height;
        }
        return data;
    };

    drawRoundBracket = (svg, x1, y1, x2, y2) => {
        svg.append('path')
            .attr('d', 'M ' + x1 +' '+ y1 + ' q -45 100' + ' 0  200 M ' + x1 +' '+ y1 + ' q -40 100' + ' 0 200')
            .attr('stroke', 'black')
            .attr('stroke-width', '3')
            .attr('fill', 'none');
        svg.append('path')
            .attr('d', 'M ' + x2 +' '+ y2 + ' q 45 100' + ' 0 200 M ' + x2 +' '+ y2 + ' q 40 100' + ' 0 200')
            .attr('stroke', 'black')
            .attr('stroke-width', '3')
            .attr('fill', 'none');
    };

    drawKreuz = (svg, x, y) => {
        svg.append('svg')
            .attr('x', x - 10)
            .attr('y', y - 20)
            .append('path')
            .attr('d', 'M20,0 L0,40 M0,0 L20,40')
            .attr('stroke', 'black')
            .attr('stroke-width', '2');
    };

    drawMatrixDescr = (svg, x, y, width, refVisTemp) => {
        const svgTemp = d3.select(refVisTemp).html(); //TODO take only svg
        const halfWidth = width / 2;
        const widthOfDescr = 9; //TODO take this from selector
        svg.append("svg")
            .attr('x', x + halfWidth - widthOfDescr)
            .attr('y', y)
            .attr("width", 35)
            .attr("height", 35)
            .append("foreignObject").attr("width",35).attr("height",35)
            .html(svgTemp)
        ;
    };

    drawFirstMatrix = () => {
        const {matrixSvg} = this.state;
        const width = this.state.widthOfCell;
        const heightOfCell = this.state.heightOfCell;
        const data = this.prepareMatrixData(9, 1); //TODO
        this.drawRoundBracket(matrixSvg, 28, 50, 28 + width, 50);
        this.drawKreuz(matrixSvg, 28 + width + (128 - (28 + width))/2, 60 + 9*heightOfCell / 2);
        this.drawMatrixDescr(matrixSvg, 28, 15, width, this.refVisTempOne);
        const matrixSvgOne = matrixSvg.append('svg')
            .attr('x', 28)
            .attr('y', 60);

        const row = matrixSvgOne.selectAll('.row')
            .data(data)
            .enter().append('g')
            .attr('class', 'row');

        const cell = row.selectAll('.cell')
            .data(d => d)
            .enter().append('g')
            .attr('class', 'cell');

        cell.append('rect')
            .attr('class', 'square')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('width', d => d.width)
            .attr('height', d => d.height)
            .style('fill', '#fff')
            // .style('opacity', '0.1')
            //.style('stroke', '#222')
            // .style("stroke-opacity", .9)
            .on('click', function (d) {
                d.click++;
                if ((d.click) % 4 === 0) {
                    d3.select(this).style('fill', '#fff');
                }
                if ((d.click) % 4 === 1) {
                    d3.select(this).style('fill', '#2C93E8');
                }
                if ((d.click) % 4 === 2) {
                    d3.select(this).style('fill', '#F56C4E');
                }
                if ((d.click) % 4 === 3) {
                    d3.select(this).style('fill', '#838690');
                }
            });

        cell.append('svg')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('width', d => d.width)
            .attr('height', d => d.height)
            .append('text').text(d => d.value)
            .attr('x', '50%')
            .attr('y', '50%')
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'middle')
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px");
    };

    drawSecondMatrix = () => {
        const {matrixSvg} = this.state;
        const width = this.state.widthOfCell;
        const numberOfInputNeuron = this.state.numberOfInputNeuron;
        const numberOfOutputNeuron = this.state.numberOfOutputNeuron;
        const data = this.prepareMatrixData(numberOfInputNeuron, numberOfOutputNeuron);
        this.drawRoundBracket(matrixSvg, 128, 50, 128 + (width*numberOfInputNeuron), 50);
        this.drawMatrixDescr(matrixSvg, 128, 25, (width*9), this.refVisTempTwo);
        const matrixSvgTwo = matrixSvg.append('svg')
            .attr('x', 128)  //28
            .attr('y', 60);   //10
        const row = matrixSvgTwo.selectAll('.row')
            .data(data)
            .enter().append('g')
            .attr('class', 'row');

        const cell = row.selectAll('.cell')
            .data(d => d)
            .enter().append('g')
            .attr('class', 'cell');

        cell.append('rect')
            .attr('class', 'square')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('width', d => d.width)
            .attr('height', d => d.height)
            .style('fill', '#fff')
            // .style('opacity', '0.1')
            //.style('stroke', '#222')
            // .style("stroke-opacity", .9)
            .on('click', function (d) {
                d.click++;
                if ((d.click) % 4 === 0) {
                    d3.select(this).style('fill', '#fff');
                }
                if ((d.click) % 4 === 1) {
                    d3.select(this).style('fill', '#2C93E8');
                }
                if ((d.click) % 4 === 2) {
                    d3.select(this).style('fill', '#F56C4E');
                }
                if ((d.click) % 4 === 3) {
                    d3.select(this).style('fill', '#838690');
                }
            });

        cell.append('svg')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('width', d => d.width)
            .attr('height', d => d.height)
            .append('text').text(d => d.value)
            .attr('x', '50%')
            .attr('y', '50%')
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'middle')
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px");
    };

    render() {
        const { classes } = this.props;
        return (
            <div className='App'>
                <header className='App-header'>
                    <div>
                        Visualisation of neural network
                    </div>
                    <div className={'small'}>The whole algorithm consist only of 10 simple steps.</div>
                </header>
                <div className='Main-container'>
                    <div className='matrix'>
                        some info

                            <Provider>
                                <p>
                                    <Node inline>{this.state.currentStepFormula}</Node>
                                </p>
                            </Provider>

                    </div>
                    <div className='d3body'>
                        <div ref={refVis => (this.refVis = refVis)}>
                            <div style={{display: 'none'}} ref={refVis => (this.refVisTempOne = refVis)}>
                                <Provider>
                                    <Node inline>{this.state.descrOne}</Node>
                                </Provider>
                            </div>
                            <div style={{display: 'none'}} ref={refVis => (this.refVisTempTwo = refVis)}>
                                <Provider>
                                    <Node inline>{this.state.descrTwo}</Node>
                                </Provider>
                            </div>

                            <svg ref={viz => (this.viz = viz)}
                                 width={this.state.width} height={this.state.height}/>
                        </div>
                    </div>
                    <StepperNN
                        setStepDescription={this.setStepDescription}
                    />
                    <div className={'footer'}>
                        <button onClick={this.updateChart}>update</button>
                        <button onClick={this.drawFirstMatrix}>draw first matrix</button>
                        <button onClick={this.drawSecondMatrix}>draw second matrix</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Training);
