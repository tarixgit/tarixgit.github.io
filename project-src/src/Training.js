import React, {Component} from 'react';
import { renderToStaticMarkup } from 'react-dom/server'
import {withStyles} from '@material-ui/core/styles';
import './Trainig.css';
import StepperNN from './StepperNN';
import Typography from "@material-ui/core/es/Typography/Typography";
import Modal from '@material-ui/core/Modal';
import symbol from './symbolSVG';
const { Provider, Node } = require("@nteract/mathjax");
const d3 = require('d3');
const math = require('mathjs');

const styles = theme => ({
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
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    },
});

class Training extends Component {
    constructor(props) {
        super(props);
        const state = {
            oneInArr: [0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1],
            expectedOutputArr: [0, 0, 1, 0, 0, 0, 0, 0, 0],
            numberOfInputNeuron: 15,
            numberOfNeuronInHiddenLayer: 15,
            numberOfOutputNeuron: 9,
            widthOfCell: 20,
            heightOfCell: 20,
            counter: 0,
            width: 1280,
            height: 645,
            radius: 18,
            widthOfDesr: 35,
            hiddenLayers: 1, //don't change
            selectedStep: 0,
            descrFormulaOne: String.raw`\overrightarrow{O}`,
            descrFormulaTwo: String.raw`W_1`,
            currentStepFormula: this.getStepContent(0),
            currentDescription: this.getStepDescription(0),
            currentStep: 0,
            matrixSvgOne: null,
            matrixSvgTwo: null,
            isModalOpen: false,
            weightOneData: this.generateWeight(15, 15),
            weightTwoData: this.generateWeight(15, 9),
            sizeOfPicture: {h:5, w:3},
        };
        this.state = {
            ...state,
            input: this.prepareMatrixData(state.numberOfInputNeuron, 1, state.oneInArr, false, state.widthOfCell, state.heightOfCell, 0),
            expectedOutput: this.prepareMatrixData(state.numberOfOutputNeuron, 1, state.expectedOutputArr, false,  state.widthOfCell, state.heightOfCell, 1),
            weightOneMatrixData: this.prepareMatrixData(state.numberOfInputNeuron, state.numberOfNeuronInHiddenLayer, state.weightOneData, true, state.widthOfCell, state.heightOfCell, 1),
            weightTwoMatrixData: this.prepareMatrixData(state.numberOfNeuronInHiddenLayer, state.numberOfOutputNeuron, state.weightTwoData, true, state.widthOfCell, state.heightOfCell, 1),
            inputImageData: this.prepareMatrixData(state.sizeOfPicture.h, state.sizeOfPicture.w, state.oneInArr, false, state.widthOfCell, state.heightOfCell, 0) //TODO use constant

    };
    }

    componentDidMount(props, state, root) {
        const svg = d3.select(this.viz);
        const svgGraph = svg
            .append('svg')
            .attr('y', -15);
        const matrixSvg = svg.append('svg')
            .attr('x', 20)
            .attr('y', 20);
        const svgInput = svg.append('svg');
        //this.drawFirstMatrix(matrixSvg);
        this.setState({svg, svgGraph, matrixSvg, svgInput});
        this.updateChart(svgGraph);
        this.setStep(0, matrixSvg, svgGraph, svgInput);
    }

    // componentDidUpdate(prevProps, prevState) {
    //     //this.updateChart(null, this.state.svgGraph);
    //     if (!!prevState.matrixSvg) {
    //         this.setStep(0);
    //     }
    // }
    generateWeight = (rows, columns) => {
        let result = [];
        for (let i = 0; i < rows; i++) {
            let arr = [];
            for (let j = 0; j < columns; j++) {
                arr.push(Math.random()); // 0 (inclusive),  and 1 (exclusive)
            }
            result.push(arr);
        }
        return result;
    };

    getStepDescription = (step) => {
        switch (step) {
            case 0:
                return {
                    head: 'Welcome to visualisation of Neural network algorithm',
                    body: (<div>
                        <p>
                            {'The neural network consists of neurons and connections between neurons. Neurons are here nodes. ' +
                            'Connection are edges. As input we become some features about the given object. Output can show us to which group this object belongs (if aim of NN is classification).'}
                        </p>
                        <p>
                            {'The most popular problem that has been tried to be solved with Neural Network(NN) is classification, ' +
                            'for example classification of handwritten numbers. ' +
                            'At the initial phase we take the input data and prepare this for the algorithm of NN and ' +
                            'generate the weights for each data element randomly between 0 and 1.'}
                        </p>
                        <p>
                            {'We\'ll show you how the NN algorithm will work on example of recognition of number 1' +
                            ' As features we take here every pixels of image and transform this to the range between 0 and 1.'}
                        </p>
                        <p>
                            {'Here we show you the first part - training'}
                        </p>
                    </div>)

                };
            case 1:
                return {
                    head: 'Multiple input with weight',
                    body: (<div>
                        <p>
                            {'The first step of algorithm show the multiply of the input(Vector O) with the weights(W) and take the sigmoid function of this.'}
                        </p>
                        <p>
                            {'- vector and matrix multiplication'}
                        </p>
                        <p>
                            {'- take a sigmoid fucntion of result'}
                        </p>
                    </div>)

                };
            case 2:
                return {
                    head: 'Multiple output  with weight',
                    body: (<div>
                        <p>
                            {'The result of the step before we take as input for this step.'}
                        </p>
                        <p>
                            {'- vector and matrix multiplication'}
                        </p>
                        <p>
                            {'- take a sigmoid fucntion of result'}
                        </p>
                    </div>)

                };
            case 3:
                return {
                    head: 'Deviation of error',
                    body: (<div>
                        <p>
                            {'By this step wir become already the output of NN. And by training phase is here most important place.'}
                        </p>
                        <p>
                            {'We expect that NN give us possibility, which number we take to process. ' +
                            'Cause the network didn\'t learn the numbers. It give us the wrong result. ' +
                            'Now we calculate the errors, how far we are from correct result and use this to adjust over weights.'}
                        </p>
                        <p>
                            {'-  subtraction of NN the result  and expected output(t)'}
                        </p>
                    </div>)

                };
            case 4:
                return {
                    head: 'Welcome to visualisation of Neural network algorithm',
                    body: (<div>
                        <p>
                            {''}
                        </p>
                    </div>)

                };
            case 5:
                return {
                    head: 'Welcome to visualisation of Neural network algorithm',
                    body: (<div>
                        <p>
                            {''}
                        </p>
                    </div>)

                };
            case 6:
                return {
                    head: 'Welcome to visualisation of Neural network algorithm',
                    body: (<div>
                        <p>
                            {''}
                        </p>
                    </div>)

                };
            case 7:
                return {
                    head: 'Welcome to visualisation of Neural network algorithm',
                    body: (<div>
                        <p>
                            {''}
                        </p>
                    </div>)

                };
            case 8:
                return {
                    head: 'Welcome to visualisation of Neural network algorithm',
                    body: (<div>
                        <p>
                            {''}
                        </p>
                    </div>)

                };
            case 9:
                return {
                    head: 'Correction coefficient 1',
                    body: (<div>
                        <p>
                            {''}
                        </p>
                    </div>)

                };
            case 10:
                return {
                    head: 'Correction coefficient 2',
                    body: (<div>
                        <p>
                            {''}
                        </p>
                    </div>)

                };
            case 11:
                return {
                    head: 'One cycle of training completed',
                    body: (<div>
                        <p>
                            {'After the processing of one picture/data element is completed, algorithm take the next data and' +
                            ' start the same process again.'}
                        </p>
                    </div>)

                };
            default:
                return 'Algo take the next Data and start again.';
        }
    };

    getStepContent = (step) => {
        switch (step) {
            case 0:
                return '';
            case 1:
                return String.raw`\overrightarrow{O^1} = S(\overrightarrow{O}, W_1)`;
            case 2:
                return String.raw`\overrightarrow{O^2} = S(\overrightarrow{O^1}, W_2)`;
            case 3:
                return String.raw`\overrightarrow{e} = \begin{pmatrix} O^2_1 - t_1 \\ O^2_2 - t_2 \\ \vdots \\ O^2_m - t_m \\ \end{pmatrix}`;
            // case 4:
            //     return String.raw`E = \frac{1}{2}\{(O^2_1 - t_1)^2 + (O^2_2 - t_2)^2 + ... +(O^2_m - t_m)^2\}`;
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
            case 10:
                return '';
            default:
                return '';
        }
    };

    getStepFormulaDescription = (step) => {
        switch (step) {
            case 0:
                return {
                    descrFormulaOne: String.raw`\overrightarrow{O}`,
                    descrFormulaTwo: String.raw`W_1`
                };
            case 1:
                return {
                    descrFormulaOne: String.raw`\overrightarrow{O}`,
                    descrFormulaTwo: String.raw`W_1`
                };
            case 2:
                return {
                    descrFormulaOne: String.raw`\overrightarrow{O^2}`,
                    descrFormulaTwo: String.raw`W_2`
                };
            case 3:
                return String.raw`\overrightarrow{e} = \begin{pmatrix} O^2_1 - t_1 \\ O^2_2 - t_2 \\ \vdots \\ O^2_m - t_m \\ \end{pmatrix}`;
            case 4:
                return String.raw`E = \frac{1}{2}\{(O^2_1 - t_1)^2 + (O^2_2 - t_2)^2 + ... +(O^2_m - t_m)^2\}`;
            case 5:
                return String.raw`D_2 = \begin{pmatrix} O^2_1(1 - O^2_1) & \cdots & \cdots \\ \cdots & O^2_2(1 - O^2_2) & \cdots \\ \cdots & \cdots & O^2_m(1 - O^2_m)\\ \end{pmatrix}`;
            case 6:
                return String.raw`D_1 = \begin{pmatrix} O^1_1(1 - O^1_1) & \cdots & \cdots \\ \cdots & O^1_2(1 - O^2_2) & \cdots \\ \cdots & \cdots & O^1_k(1 - O^1_k)\\ \end{pmatrix}`;
            case 7:
                return String.raw`\overrightarrow{\delta^2} = D_2 * \overrightarrow{e}`;
            case 8:
                return String.raw`\overrightarrow{\delta^1} = D_1 * W_2 * \overrightarrow{e}`;
            case 9:
                return String.raw`\overrightarrow{\Delta w_2^T} = - \gamma * \overrightarrow{\delta^2}`;
            case 10:
                return String.raw`\overrightarrow{\Delta w_1^T} = - \gamma * \overrightarrow{\delta^1}`;
            case 11:
                return '';
            default:
                return '';
        }
    }

    updateLeftView = (step, matrixSvg, svgGraph, svgInput) => {
        const {widthOfCell, heightOfCell} = this.state;
        switch (step) {
            case 0: {
                const {input, inputImageData, sizeOfPicture} = this.state;
                const y = this.state.widthOfDesr;
                const coordX = 28;
                const coordY = 50;
                if (!!this.state.svgInput) {
                    this.moveSvgInputBack(svgInput); //input image
                } else {
                    this.drawOneDescr(svgInput, coordX + 20, coordY + 20, sizeOfPicture.w * widthOfCell, heightOfCell); // 20 - because separate svg-father
                    this.drawOne(svgInput, inputImageData, coordX + 20, coordY + 20, 500); // 20 - because separate svg-father
                }

                this.drawArrowDown(matrixSvg, coordX + (sizeOfPicture.w * widthOfCell / 2), coordY + (sizeOfPicture.h + 1) * heightOfCell, 1500);
                this.drawOneAsMatrix(matrixSvg, inputImageData, coordX, coordY + sizeOfPicture.h*heightOfCell + 50, 2500);
                this.drawArrowRight(matrixSvg, coordX + (sizeOfPicture.w+1) * widthOfCell, coordY + sizeOfPicture.h*heightOfCell + 50 +
                    (heightOfCell * sizeOfPicture.h/2), 3500);
                this.drawFirstMatrix(matrixSvg, input, coordX + (sizeOfPicture.w+1)*widthOfCell + 125, y, 4500, symbol.inputO);
                this.drawArrowRight(matrixSvg, 200 + coordX + (sizeOfPicture.w+1) * widthOfCell, coordY + sizeOfPicture.h*heightOfCell + 50 +
                    (heightOfCell * sizeOfPicture.h/2), 5500); // = 200 - is not calculated
                this.updateChart(svgGraph, 6500, this.state.oneInArr);
                this.setState({input});
                return;
            }
            case 1: {
                const coordX = 28;
                const coordY = 50;
                const {widthOfCell, weightOneMatrixData, input, sizeOfPicture} = this.state;

                const yPosition = svgInput.attr('y'); //out image
                this.moveSvgInput(svgInput, coordX + 20, coordY + 2, sizeOfPicture, widthOfCell, 200);
                this.drawFirstMatrix(matrixSvg, input, 28, 60, yPosition > 0 ? 200 : 1200, symbol.inputO);
                this.drawSecondMatrix(matrixSvg, weightOneMatrixData, 128, 60, 2500, symbol.weightW1);
                symbol.assignment(matrixSvg, 350, 250, 3500);
                symbol.outputO1(matrixSvg, 370, 245, 3500);
                this.calculate(step);
                return;
            }
            case 2: {
                const {outputOneMatrixData, weightTwoMatrixData} = this.state;
                this.drawFirstMatrix(matrixSvg, outputOneMatrixData, 28, 60, 200, symbol.outputO1);
                this.drawSecondMatrix(matrixSvg, weightTwoMatrixData, 128, 60, 2500, symbol.weightW2);
                symbol.assignment(matrixSvg, 350, 250, 3500);
                symbol.outputO2(matrixSvg, 370, 245, 3500);
                this.calculate(step);
                return;
            }
            case 3: {
                const {outputTwoMatrixData, expectedOutput, widthOfCell} = this.state;
                this.drawFirstMatrix(matrixSvg, outputTwoMatrixData, 28, 60, 200, symbol.outputO2, widthOfCell + 20);
                symbol.minus(matrixSvg, 80 + 20, 240, 1000);
                this.drawFirstMatrix(matrixSvg, expectedOutput, 128 + 20, 60, 1200, 't');
                symbol.assignment(matrixSvg, 180 + 20, 238, 2000);
                this.calculate(step);
                matrixSvg.append('text').text('e')
                    .attr("x", 200 + 20)
                    .attr("y", 273)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "24px")
                    .style('opacity', .0)
                    .transition()
                    .delay(2000)
                    .duration(1000)
                    .style('opacity', .9);
                return;
            }
            case 4: {
                matrixSvg.append('text').text('This step is in implementing stage.')
                    .attr("x", 0)
                    .attr("y", 60)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "24px")
                    .style('opacity', .0)
                    .transition()
                    .delay(500)
                    .duration(1000)
                    .style('opacity', .9);
                return;
            }
            case 5: {
                matrixSvg.append('text').text('This step is in implementing stage.')
                    .attr("x", 0)
                    .attr("y", 60)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "24px")
                    .style('opacity', .0)
                    .transition()
                    .delay(500)
                    .duration(1000)
                    .style('opacity', .9);
                return;
            }
            case 6: {
                matrixSvg.append('text').text('This step is in implementing stage.')
                    .attr("x", 0)
                    .attr("y", 60)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "24px")
                    .style('opacity', .0)
                    .transition()
                    .delay(500)
                    .duration(1000)
                    .style('opacity', .9);
                return;
            }
            case 7: {
                matrixSvg.append('text').text('This step is in implementing stage.')
                    .attr("x", 0)
                    .attr("y", 60)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "24px")
                    .style('opacity', .0)
                    .transition()
                    .delay(500)
                    .duration(1000)
                    .style('opacity', .9);
                return;
            }
            case 8: {
                matrixSvg.append('text').text('This step is in implementing stage.')
                    .attr("x", 0)
                    .attr("y", 60)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "24px")
                    .style('opacity', .0)
                    .transition()
                    .delay(500)
                    .duration(1000)
                    .style('opacity', .9);
                return;
            }
            case 9: {
                matrixSvg.append('text').text('This step is in implementing stage.')
                    .attr("x", 0)
                    .attr("y", 60)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "24px")
                    .style('opacity', .0)
                    .transition()
                    .delay(500)
                    .duration(1000)
                    .style('opacity', .9);
                return;
            }
            case 10: {
                matrixSvg.append('text').text('This step is in implementing stage.')
                    .attr("x", 0)
                    .attr("y", 60)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "24px")
                    .style('opacity', .0)
                    .transition()
                    .delay(500)
                    .duration(1000)
                    .style('opacity', .9);
                return;
            }
            default:
                return;
        }
    };

    calculate = (step) => {
        switch (step) {
            case 1: {
                const inputVector = math.matrix(this.state.oneInArr);
                const weightOne = math.matrix(this.state.weightOneData);
                const hiddenLayerVector = math.multiply(inputVector, weightOne);
                const outputOneVector = hiddenLayerVector.map(value => 1 / (1 + Math.exp(-value))); // sigmoid function
                this.updateChart(this.state.svgGraph, 1000, this.state.oneInArr, outputOneVector.toArray());
                const outputOneMatrixData = this.prepareMatrixData(this.state.numberOfNeuronInHiddenLayer, 1,
                    outputOneVector.toArray(), false, this.state.widthOfCell, this.state.heightOfCell, 1);
                this.setState({outputOneMatrixData, outputOne: outputOneVector.toArray()});
                return;
            }
            case 2: {
                const outputOne = math.matrix(this.state.outputOne);
                const weightTwo = math.matrix(this.state.weightTwoData);
                let outputVector = math.multiply(outputOne, weightTwo);
                const outputTwoVector = outputVector.map(value => 1 / (1 + Math.exp(-value))); // sigmoid function
                this.updateChart(this.state.svgGraph, 1000, this.state.oneInArr, this.state.outputOne, outputTwoVector.toArray());
                const outputTwoMatrixData = this.prepareMatrixData(this.state.numberOfOutputNeuron, 1,
                    outputTwoVector.toArray(), false, this.state.widthOfCell + 20, this.state.heightOfCell, 3);
                this.setState({outputTwoMatrixData, outputTwo: outputTwoVector.toArray()});
                return;
            }
            case 3: {
                const outputTwo = math.matrix(this.state.outputTwo);
                const expectedOutput = math.matrix(this.state.expectedOutputArr);
                let error = math.subtract(outputTwo, expectedOutput);
                error = error.map(value =>Math.abs(value));
                // const outputTwoMatrixData = this.prepareMatrixData(this.state.numberOfOutputNeuron, 1,
                //     outputTwoVector.toArray(), true, this.state.widthOfCell, this.state.heightOfCell);
                this.setState({error: error.toArray()});
                return;
            }
            default: {
                return;
            }
        }
    };

    setStep = (currentStep, svgNew, svgGraphNew, svgInputNew) => {
        const currentStepFormula = this.getStepContent(currentStep);
        const currentDescription = this.getStepDescription(currentStep);
        const {descrFormulaOne, descrFormulaTwo} = this.getStepFormulaDescription(currentStep);
        this.setState({
            currentStepFormula,
            currentDescription,
            currentStep,
            descrFormulaOne: descrFormulaOne,
            descrFormulaTwo: descrFormulaTwo
        });

        const matrixSvg = !!svgNew ? svgNew : this.state.matrixSvg;
        const svgGraph = !!svgGraphNew ? svgGraphNew : this.state.svgGraph;
        const svgInput = !!svgInputNew ? svgInputNew : this.state.svgInput;
        //TODO move this to switch
        // before remove all move picture to the right
        if (!!matrixSvg) {
            matrixSvg.selectAll("*").remove();
        } else {
            return;
        }
        this.updateLeftView(currentStep, matrixSvg, svgGraph, svgInput);
    };

    updateChart = (svgNew, delay, inputVector, hiddenLayerVector, outputVector) => {
        // Define the div for the tooltip
        const mschubY = 40;
        const schubX = 300;
        const firstXCoordinate = 450;
        const svgGraphWithSymbols = svgNew; //???
        let ipnutData = [];
        let outputData = [];
        let hiddenLayerData = [];
        if (!!svgGraphWithSymbols) {  //TODO fix this
            svgGraphWithSymbols.selectAll("*").remove();
        } else {
            return;
        }

        const svgGraph = svgGraphWithSymbols
            .append('svg')
            .attr('x', 0)
            .attr('y', 25);

        const svgSymbolsPanel = svgGraphWithSymbols.append('svg');
        //Daten vorbereiten
        for (let i = 1; i <= this.state.numberOfInputNeuron; i++) {
            ipnutData.push({
                x: firstXCoordinate,
                y: i * mschubY,
                neuronValue: inputVector ? inputVector[i-1] : 0,
                neuronValue: inputVector ? inputVector[i-1] : 0
            })
        }
        for (let i = 1; i <= this.state.numberOfOutputNeuron; i++) {
            outputData.push({
                x: firstXCoordinate + ((this.state.hiddenLayers + 1) * schubX),
                y: i * mschubY,
                neuronValue: outputVector ? outputVector[i-1] : 0,
                neuronValue: outputVector ? outputVector[i-1] : 0
            })
        }
        hiddenLayerData.push(ipnutData);
        for (let i = 1; i <= this.state.hiddenLayers; i++) {  // ===1
            const currentLayer = [];
            for (let j = 1; j <= this.state.numberOfInputNeuron; j++) {
                currentLayer.push({
                    x: firstXCoordinate + (i * schubX),
                    y: j * mschubY,
                    neuronValue: hiddenLayerVector ? hiddenLayerVector[j - 1] : 0, //will not for for all cases
                    neuronValue: hiddenLayerVector ? hiddenLayerVector[j - 1] : 0
                })
            }
            hiddenLayerData.push(currentLayer);
        }
        hiddenLayerData.push(outputData);

        symbol.inputO(svgSymbolsPanel, firstXCoordinate - 8, 0);
        symbol.weightW1(svgSymbolsPanel, firstXCoordinate + (this.state.hiddenLayers * schubX) / 2 - 10, 0);
        symbol.outputO1(svgSymbolsPanel, firstXCoordinate + (this.state.hiddenLayers) * schubX - 8, 0);
        symbol.weightW2(svgSymbolsPanel, firstXCoordinate + (this.state.hiddenLayers) * schubX + this.state.hiddenLayers * schubX / 2 - 10, 0);
        symbol.outputO2(svgSymbolsPanel, firstXCoordinate + (this.state.hiddenLayers + 1) * schubX - 8, 0);
        //draw the tooltip
        const div = d3.select(this.refVis).append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        const greens = d3.scaleSequential()
            .domain([0, 100])
            .interpolator(d3.interpolateGreens);
        //draw the circles
        // all layers
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
                .style('fill', '#FFF') //TODO !!!!!!!!
                //.style('fill', '#47BA36') //TODO !!!!!!!!
                .on('mouseover', d => {
                    div.transition()
                        .duration(200)
                        .style('opacity', .9);
                    div.html(() => layerIndex === 1 ?  'HiddenL' + layerIndex + '<br/>' + d.neuronValue.toFixed(5) :
                        'Layer' + layerIndex + '<br/>' + d.neuronValue.toFixed(5))
                        .style('left', (d3.event.pageX + 10) + 'px')
                        .style('top', (d3.event.pageY - 18) + 'px');
                }).on('mouseout', d => {
                    div.transition()
                        .duration(500)
                        .style('opacity', 0);
                }).transition()
                .delay(delay ? delay : 0)
                .duration(delay ? 2500 : 0)
                .style('fill', d => {
                    if (d.neuronValue === 1) {
                        return '#47BA36';
                    } else if (d.neuronValue === 0) {
                        return '#FFF';
                    }
                    return greens((d.neuronValue.toFixed(2) * 100));
                });
        });

        const preparedWeightOne = this.state.weightOneData.map(item => item.map(item2 => item2.toFixed(5)));
        const preparedWeightTwo = this.state.weightTwoData.map(item => item.map(item2 => item2.toFixed(5)));
        //draw the lines
        hiddenLayerData.forEach((currentLayer, layerIndex) => {
            if (layerIndex == 0) {
                return;
            }
            const accessorLayer = hiddenLayerData[layerIndex - 1];
            // take data of weights  from accessorLayer
            //
            const outspace = 3;
            accessorLayer.forEach((accessor, accessorIndex) => {
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
                    .on('mouseover', (d, index) => {
                        div.transition()
                            .duration(200)
                            .style('opacity', .9);
                        div.html(() => layerIndex === 1 ? 'W1:' +  '<br/>' + preparedWeightOne[accessorIndex][index] :
                            'W2:' +  '<br/>' + preparedWeightTwo[accessorIndex][index])
                            .style('left', (d3.event.pageX + 10) + 'px')
                            .style('top', (d3.event.pageY - 18) + 'px');
                    })
                    .on('mouseout', d => {
                        div.transition()
                            .duration(500)
                            .style('opacity', 0);
                    })

            });
        });
    };

    prepareMatrixData = (matrixRows, matrixColumns, inputData, isInputArrTwoDimensional, widthOfCell, heightOfCell, truncateNumber) => {
        //TODO inputData - is vector or matrix
        const data = [];
        let xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
        let ypos = 1;
        const width = widthOfCell ? widthOfCell : this.state.widthOfCell;
        const height = heightOfCell ? heightOfCell : this.state.heightOfCell;
        const click = 0;
        let index = 0;
        // iterate for rows
        for (let row = 0; row < matrixRows; row++) {
            data.push([]);

            if (matrixColumns > 9) { //temporal, because to small place
                for (let column = 0; column < 8; column++) {
                    data[row].push({
                        x: xpos,
                        y: ypos,
                        width: width,
                        height: height,
                        click: click,
                        value: isInputArrTwoDimensional ? inputData[row][column].toFixed(truncateNumber) : inputData[index].toFixed(truncateNumber)
                    });
                    index ++;
                    xpos += width;
                }
                data[row].push({
                    x: xpos,
                    y: ypos,
                    width: width,
                    height: height,
                    click: click,
                    value: '...'
                });
                index ++;
                xpos += width;
            } else {
                // iterate for cells/columns inside rows
                for (let column = 0; column < matrixColumns; column++) {
                    data[row].push({
                        x: xpos,
                        y: ypos,
                        width: width,
                        height: height,
                        click: click,
                        value: isInputArrTwoDimensional ? inputData[row][column].toFixed(truncateNumber) : inputData[index].toFixed(truncateNumber)
                    });
                    // increment the x position. I.e. move it over by 50 (width variable)
                    index ++;
                    xpos += width;
                }
            }
            // reset the x position after a row is complete
            xpos = 1;
            // increment the y position for the next row. Move it down 50 (height variable)
            ypos += height;
        }
        return data;
    };

    drawRoundBracket = (svg, x1, y1, x2, y2, dy) => {
        svg.append('path')
            .attr('d', 'M ' + x1 +', '+ y1 + ' C ' + (x1-30) + ',' + (y1 + dy/3) + ' ' + (x1-30) + ',' + (y1 + dy*2/3)  + ' ' + x1 + ',' + (y1+dy)
                + ' M ' + x1 +', '+ y1 + ' C ' + (x1-30) + ',' + (y1 + dy/3) + ' ' + (x1-30) + ',' + (y1 + dy*2/3)  + ' ' + x1 + ',' + (y1+dy))
            .attr('stroke', 'black')
            .attr('stroke-width', '2')
            .attr('fill', 'none');
        svg.append('path')
            .attr('d', 'M ' + x2 +' '+ y2 + ' C ' + (x2+30) + ',' + (y2 + dy/3) + ' ' + (x2+30) + ',' + (y2 + dy*2/3)  + ' ' + x2 + ',' + (y2+dy)
                + ' M ' + x2 +' '+ y2 + ' C ' + (x2+30) + ',' + (y2 + dy/3) + ' ' + (x2+30) + ',' + (y2 + dy*2/3)  + ' ' + x2 + ',' + (y2+dy))
            .attr('stroke', 'black')
            .attr('stroke-width', '2')
            .attr('fill', 'none');
    };

    drawKreuz = (svg, x, y) => {
        svg.append('svg')
            .attr('x', x - 10) //from size of kreuz
            .attr('y', y - 20)
            .append('path')
            .attr('d', 'M20,0 L0,40 M0,0 L20,40')
            .attr('stroke', 'black')
            .attr('stroke-width', '2');
    };

    drawMatrixDescr = (svg, x, y, width, refVisTemp, withoutArrow) => {
        const svgTemp = d3.select(refVisTemp).html(); //TODO take only svg
        const halfWidth = width / 2;
        const widthOfDescr = 9; //TODO take this from selector
        svg.append("svg")
            .attr('x', x + halfWidth - widthOfDescr)
            .attr('y', withoutArrow ? y - 25 : y - 35)
            .attr("width", 35)
            .attr("height", 35)
            .append("foreignObject").attr("width",35).attr("height",35)
            .html(svgTemp)
        ;
    };

    drawFirstMatrix = (matrixSvg, matrixData, x_coord, y_coord, delay, descrFunction, width) => {
        const newMatrixSvg =  matrixSvg.append('svg')
            .attr('x', 0)  //28
            .attr('y', 0)
            .style('opacity', !!delay ? .0 : 1);
        const x = x_coord ? x_coord: 28;
        const y = y_coord ? y_coord + 60: 60;
        const numberOfrows = this.state.numberOfInputNeuron;
        const widthOfCell = width ? width : this.state.widthOfCell;
        this.drawRoundBracket(newMatrixSvg, x, y-10, x + widthOfCell, y-10, this.state.widthOfCell*(numberOfrows+1));
        //this.drawMatrixDescr(newMatrixSvg, x, y, width, this.refVisTempOne);
        if (typeof descrFunction === "function") {
            descrFunction(newMatrixSvg, x + widthOfCell / 2 - 10 , y - 60);
        } else {
            newMatrixSvg.append('text').text('T')
                .attr("x", x + 4)
                .attr("y", y - 19)
                .attr("font-family", "sans-serif")
                .attr("font-size", "24px");
        }
        const matrixSvgOne = this.drawMatrix(newMatrixSvg, matrixData, x, y);
        this.setState({matrixSvgOne});

        newMatrixSvg.transition()
            .delay(delay)
            .duration(1000)
            .style('opacity', .9);
    };

    drawSecondMatrix = (matrixSvg,  matrixData, x_coord, y_coord, delay, descrFunction) => { // to think about this step
        const newMatrixSvg =  matrixSvg.append('svg')
            .attr('x', 0)  //28
            .attr('y', 0)
            .style('opacity', !!delay ? .0 : 1);
        const x = x_coord ? x_coord: 128;
        const y = y_coord ? y_coord + 60: 60;
        const width = this.state.widthOfCell;
        const heightOfCell = this.state.heightOfCell;
        const numberOfInputNeuron = this.state.numberOfInputNeuron;
        const numberOfNeuronInHiddenLayer = this.state.numberOfNeuronInHiddenLayer > 9 ?  9 : this.state.numberOfNeuronInHiddenLayer; //temporal because of place
        //const data = matrixData ? matrixData : this.prepareMatrixData(numberOfInputNeuron, numberOfNeuronInHiddenLayer);
        this.drawKreuz(newMatrixSvg, 28 + width + (128 - (28 + width))/2, y + numberOfInputNeuron*heightOfCell / 2);
        this.drawRoundBracket(newMatrixSvg, x, y-10, x + (width*numberOfNeuronInHiddenLayer), y-10, heightOfCell * (numberOfInputNeuron + 1));
        //this.drawMatrixDescr(newMatrixSvg, x, y, (width*numberOfNeuronInHiddenLayer), this.refVisTempTwo, true);
        //draw description
        descrFunction(newMatrixSvg, x + width*numberOfNeuronInHiddenLayer/2 - 10, y - 50);
        const matrixSvgTwo = this.drawMatrix(newMatrixSvg, matrixData, x, y);
        this.setState({matrixSvgTwo});

        newMatrixSvg.transition()
            .delay(delay)
            .duration(1000)
            .style('opacity', .9);
    };

    drawAssignment = (matrixSvg, x_coord, y_coord, delay) => {
        const x = x_coord ? x_coord: 128;
        const y = y_coord ? y_coord + 60: 60;
        const width = this.state.widthOfCell;
        const numberOfInputNeuron = this.state.numberOfInputNeuron;
        const numberOfNeuronInHiddenLayer = this.state.numberOfNeuronInHiddenLayer;
        const heightOfCell = this.state.heightOfCell;
        symbol.assignment(matrixSvg, 128 +  width*(numberOfNeuronInHiddenLayer + 1)/2 +28, y + numberOfInputNeuron*heightOfCell / 2);

    };

    drawMatrix = (matrixSvg, data, x, y) => {
        const newMatrixSvg =  matrixSvg.append('svg')
            .attr('x', x)  //28
            .attr('y', y);   //10
        const row = newMatrixSvg.selectAll('.row')
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
        return newMatrixSvg;
    };

    drawOneDescr = (matrixSvg, x, y, width, height) => {
        const newMatrixSvg =  matrixSvg.append('svg')
            .attr('x', x - 10)
            .attr('y', y - height)
            .attr('height', 30)
            .attr('width', 200)
            .append('text')
            .text('Input image')
            .attr('x', 0)
            .attr('y', 15)
            .style('fill', '#000');

        return newMatrixSvg;
    };

    drawOne = (matrixSvg, data, x, y, delay) => {
        const newMatrixSvg =  matrixSvg.append('svg')
            .attr('x', x)  //28
            .attr('y', y)
            .style('opacity', .0);
        const row = newMatrixSvg.selectAll('.row')
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
            .style('stroke', '#000000')
            .style('fill', d =>  d.value === '1' ? '#47BA36' : '#fff');

        newMatrixSvg.transition()
            .delay(delay)
            .duration(1000)
            .style('opacity', .9);

        return newMatrixSvg;
    };

    drawOneAsMatrix = (matrixSvg, data, x, y, delay) => {
        const newMatrixSvg =  matrixSvg.append('svg')
            .attr('x', x)  //28
            .attr('y', y)
            .style('opacity', .0);
        const row = newMatrixSvg.selectAll('.row')
            .data(data)
            .enter().append('g')
            .attr('class', 'row');

        const cell = row.selectAll('.cell')
            .data(d => d)
            .enter().append('g')
            .attr('class', 'cell');

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
            .attr("font-size", "12px")
            .style('fill', d =>  d.value === '1' ? '#47BA36' : '#979797');

        newMatrixSvg.transition()
            .delay(delay)
            .duration(1000)
            .style('opacity', .9);

        return newMatrixSvg;
    };

    drawArrowDown = (svg, x, y, delay) => {
        const arrow = svg.append('svg')
            .attr('x', x - 5)
            .attr('y', y - 15)
            .style('opacity', .0);
            // .attr('width', 10)
            // .attr('height', 42)
        arrow.append('path')
            .attr('d', 'M4.5,32.5 L4.5,1 L4.5,0.5 L5.5,0.5 L5.5,1 L5.5,32.5 L9.5,32.5 L5,41.5 L0.5,32.5 L4.5,32.5 Z')
            .attr('fill', '#979797')
            .attr('fill-rule', '#nonzero')
            .attr('stroke', 'black')
            .attr('stroke-width', '1');

        arrow.transition()
            .delay(delay)
            .duration(1000)
            .style('opacity', .9);
    };

    drawArrowRight = (svg, x, y, delay) => {
        const arrow = svg.append('svg')
            .attr('x', x + 15)
            .attr('y', y - 5)
            .style('opacity', .0);
            // .attr('width', 10)
            // .attr('height', 42)
        arrow.append('path')
            .attr('d', 'M32.5,5.5 L1,5.5 L0.5,5.5 L0.5,4.5 L1,4.5 L32.5,4.5 L32.5,0.5 L41.5,5 L32.5,9.5 L32.5,5.5 Z')
            .attr('fill', '#979797')
            .attr('fill-rule', '#nonzero')
            .attr('stroke', 'black')
            .attr('stroke-width', '1');
        arrow.transition()
            .delay(delay)
            .duration(1000)
            .style('opacity', .9);
    };

    moveSvgInput = (svg, x, y, sizeOfPicture, widthOfCell, delay) => {
        const domRect = svg.node().parentNode.getBoundingClientRect();
        svg.transition()
            .ease(d3.easeSin)
            .delay(delay)
            .duration(1000)
            .attr('x', domRect.width - sizeOfPicture.w * widthOfCell - 100) //100 - is correction, i didn't catch why
            .attr('y', y + 15);
    };

    moveSvgInputBack = (svg) => {
        svg.transition()
            .ease(d3.easeSin)
            .duration(1000)
            .attr('x', 0) //100 - is correction, i didn't catch why
            .attr('y', 0);
    };

    openExplanationModal = () => {
        this.setState({ isModalOpen: true });
    };

    closeExplanationModal = () => {
        this.setState({ isModalOpen: false });
    };

    render() {
        const { classes } = this.props;
        return (
            <div className='App'>
                <header className='App-header'>
                    <Typography variant="h4" gutterBottom style={{marginBottom: 0}}>
                        Visualisation of neural network
                    </Typography>
                    <div className={'small'}>The whole algorithm consist only of 10 simple steps.</div>
                </header>
                <div className='Main-container'>
                    <div className='d3body'>
                        <div ref={refVis => (this.refVis = refVis)}>
                            <div style={{display: 'none'}} ref={refVis => (this.refVisTempOne = refVis)}>
                                <Provider>
                                    <Node inline>{this.state.descrFormulaOne}</Node>
                                </Provider>
                            </div>
                            <div style={{display: 'none'}} ref={refVis => (this.refVisTempTwo = refVis)}>
                                <Provider>
                                    <Node inline>{this.state.descrFormulaTwo}</Node>
                                </Provider>
                            </div>

                            <svg ref={viz => (this.viz = viz)}
                                 width={this.state.width} height={this.state.height}/>
                        </div>
                    </div>
                    <StepperNN
                        setStep={this.setStep}
                        openExplanationModal={this.openExplanationModal}
                    />
                    {/*TODO move this out ot separate component*/}
                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={this.state.isModalOpen}
                        onClose={this.closeExplanationModal}
                    >
                        <div style={{
                            top: `50%`,
                            left: `60%`,
                            transform: `translate(-50%, -60%)`,
                        }} className={classes.paper}>
                            <Typography variant="h6" id="modal-title">
                                {this.state.currentDescription.head}
                            </Typography>
                            <Typography variant="subtitle1" id="simple-modal-description">
                                {this.state.currentDescription.body}
                            </Typography>
                            <Typography className={classes.instructions} align={"center"}>
                                <Provider>
                                    <p>
                                        <Node inline>{this.state.currentStepFormula}</Node>
                                    </p>
                                </Provider>
                            </Typography>
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Training);
