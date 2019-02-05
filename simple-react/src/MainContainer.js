import React, {Component} from 'react';
import './MainContainer.css';
import Training from "./Training";
import NeuralNetworkClassification from './NeuralNetworkClassification';
const d3 = require('d3');


class MainContainer extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        Visualisation of neural network
                    </p>
                </header>
                <div className='Main-container'>
                    <Training/>
                    <NeuralNetworkClassification/>
                </div>
            </div>
        );
    }
}

export default MainContainer;
