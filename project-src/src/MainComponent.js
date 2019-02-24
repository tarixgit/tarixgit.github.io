import React, {Component} from 'react';
import './Trainig.css';
import Training from "./Training";
import NeuralNetwork from "./NeuralNetwork";

class MainComponent extends Component {
    render () {
        return (
            <div>
                <Training/>
                <NeuralNetwork />
            </div>
        );
    }
}
export default (MainComponent);
