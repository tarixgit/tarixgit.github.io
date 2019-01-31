import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
          const svg = this.svg = d3.select(node).append('svg');
          const data = [1,2,3,4,5,6,7,8,9,10];
          svg.append("g")
              .selectAll("circle")
              .data(data)
              .enter()
              .append("circle")
              .attr("r", 10)
              .attr("cy", 50)
              .attr("cx", (d) => {
                  return d*20;
              });
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Visualisation of neural network
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
