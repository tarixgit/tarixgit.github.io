import React, {Component} from 'react';
import TensorFlow from './TensorFlow';
import MnistData from './MnistData';
const d3 = require('d3');

class NeuralNetworkClassification extends Component {

    initialize(node, props) {
        var gridDataArray = this.gridData();
        const svg = d3.select(this.vizClass).append('svg');

        // console.log(gridDataArray);
        svg.attr("width", "210px")
           .attr("height", "210px");

        var row = svg.selectAll(".row")
            .data(gridDataArray)
            .enter().append("g")
            .attr("class", "row");

        var column = row.selectAll(".square")
            .data(function (d) { return d; })
            .enter().append("rect")
            .attr("class", "square")
            .attr("x", function (d) { return d.x; })
            .attr("y", function (d) { return d.y; })
            .attr("width", function (d) { return d.width; })
            .attr("height", function (d) { return d.height; })
            .style("fill", "#fff")
            .style("stroke", "#222")
            .on('click', function (d) {
                // console.log("onClick detected")
                d.click = !d.click;
                if (d.click) { d3.select(this).style("fill","#2C93E8"); }
            });
    }


    gridData() {
        var data = new Array();
        var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
        var ypos = 1;

        var width = 50;
        var height = 50;

        var click = false;

        var numberOfRows = 4;
        var numberOfColumns = 3

        // iterate for rows
        for (var row = 0; row < numberOfRows; row++) {
            data.push(new Array());

            // iterate for cells/columns inside rows
            for (var column = 0; column < numberOfColumns; column++) {
                data[row].push({
                    x: xpos,
                    y: ypos,
                    width: width,
                    height: height,
                    click: click
                })
                // increment the x position. I.e. move it over by 50 (width variable)
                xpos += width;
            }
            // reset the x position after a row is complete
            xpos = 1;
            // increment the y position for the next row. Move it down 50 (height variable)
            ypos += height;
        }
        return data;
    }
    render() {
        return (
            <div>
                <div ref={refVis => (this.refVis = refVis)}>
                    <svg ref={vizClass => (this.vizClass = vizClass)}/>
                </div>

            </div>
        );
    }
}

export default  NeuralNetworkClassification;
