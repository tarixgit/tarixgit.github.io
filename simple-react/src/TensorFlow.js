import React, {Component} from 'react';
import * as tf from '@tensorflow/tfjs';
import MnistData from './MnistData';
const d3 = require('d3');
// import 'bootstrap/dist/css/bootstrap.css';

var dataForModel;
var model;

class TensorFlow extends Component {

    async initialize(node, props) {

        var data = ["TEXT SAMPLE "], r = 15;
        var testTensorFlow = d3.select(node);

        var text = testTensorFlow
            .selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text(function (d) { return d })
            .style("font-family", "Arial")
            .style("font-size", "20px")
            .style("color", "red");

        testTensorFlow.append('input')
            .attr('type', 'number')
            .attr('id', 'inputValue').on("input", function () {
            // Use model to predict values
            model.predict(tf.tensor2d([parseInt(this.value)], [1, 1])).print();
        });;

        testTensorFlow
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'button')
        // .call(button);

        this.createModel()
        await this.load();
        await this.train();
        const batch = dataForModel.nextTestBatch(1);
        await this.predict(batch);

    }

    createModel() {
        // Insert the following pieces of code here
        this.createLogEntry('Create model ...');
        model = tf.sequential();
        this.createLogEntry('Model created');

        this.createLogEntry('Add layers ...');
        model.add(tf.layers.conv2d({
            inputShape: [28, 28, 1],
            kernelSize: 5,
            filters: 8,
            strides: 1,
            activation: 'relu',
            kernelInitializer: 'VarianceScaling'
        }));

        model.add(tf.layers.maxPooling2d({
            poolSize: [2, 2],
            strides: [2, 2]
        }));

        model.add(tf.layers.conv2d({
            kernelSize: 5,
            filters: 16,
            strides: 1,
            activation: 'relu',
            kernelInitializer: 'VarianceScaling'
        }));

        model.add(tf.layers.flatten());

        model.add(tf.layers.dense({
            units: 10,
            kernelInitializer: 'VarianceScaling',
            activation: 'softmax'
        }));
        this.createLogEntry('Layers created');

        this.createLogEntry('Start compiling ...');
        model.compile({
            optimizer: tf.train.sgd(0.15),
            loss: 'categoricalCrossentropy'
        });
        this.createLogEntry('Compiled');
    }

    createLogEntry(entry) {
        d3.select('log').innerHTML += '<br>' + entry;
        console.log(entry)
    }

    async load() {
        this.createLogEntry('Loading MNIST data ...');
        dataForModel = new MnistData();
        await dataForModel.load();
        this.createLogEntry('Data loaded successfully');
    }

    async predict(batch) {
        tf.tidy(() => {
            const input_value = Array.from(batch.labels.argMax(1).dataSync());

            const div = document.createElement('div');
            div.className = 'prediction-div';
            const output = model.predict(batch.xs.reshape([-1, 28, 28, 1]));
            const prediction_value = Array.from(output.argMax(1).dataSync());
            const image = batch.xs.slice([0, 0], [1, batch.xs.shape[1]]);

            const canvas = document.createElement('canvas');
            canvas.className = 'prediction-canvas';
            // draw(image.flatten(), canvas);
            const label = document.createElement('div');
            label.innerHTML = 'Original Value: ' + input_value;
            label.innerHTML += '<br>Prediction Value: ' + prediction_value;
            console.log(prediction_value + '-' + input_value);
            if (prediction_value - input_value == 0) {
                label.innerHTML += '<br>Value recognized successfully!';
            } else {
                label.innerHTML += '<br>Recognition failed!';
            }

            div.appendChild(canvas);
            div.appendChild(label);
            console.log("predicted")
            console.log('Original Value: ' + input_value)
            console.log('Prediction Value: ' + prediction_value)
            // document.getElementById('predictionResult').appendChild(div);
        });
    }

    async train() {

        const BATCH_SIZE = 64;
        const TRAIN_BATCHES = 150;

        this.createLogEntry('Start training ...');
        for (let i = 0; i < TRAIN_BATCHES; i++) {
            const batch = tf.tidy(() => {
                const batch = dataForModel.nextTrainBatch(BATCH_SIZE);
                batch.xs = batch.xs.reshape([BATCH_SIZE, 28, 28, 1]);
                return batch;
            });

            await model.fit(
                batch.xs, batch.labels, { batchSize: BATCH_SIZE, epochs: 1 }
            );
            tf.dispose(batch);
            await tf.nextFrame();
        }
        this.createLogEntry('Training complete');
    }

    async predict(batch) {
        tf.tidy(() => {
            const input_value = Array.from(batch.labels.argMax(1).dataSync());

            const div = document.createElement('div');
            div.className = 'prediction-div';
            const output = model.predict(batch.xs.reshape([-1, 28, 28, 1]));
            const prediction_value = Array.from(output.argMax(1).dataSync());
            const image = batch.xs.slice([0, 0], [1, batch.xs.shape[1]]);

            const canvas = document.createElement('canvas');
            canvas.className = 'prediction-canvas';
            // draw(image.flatten(), canvas);
            const label = document.createElement('div');
            label.innerHTML = 'Original Value: ' + input_value;
            label.innerHTML += '<br>Prediction Value: ' + prediction_value;
            console.log(prediction_value + '-' + input_value);
            if (prediction_value - input_value == 0) {
                label.innerHTML += '<br>Value recognized successfully!';
            } else {
                label.innerHTML += '<br>Recognition failed!';
            }

            div.appendChild(canvas);
            div.appendChild(label);
            // document.getElementById('predictionResult').appendChild(div);
        });
    }
}

export default  TensorFlow;