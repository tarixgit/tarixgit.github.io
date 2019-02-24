const React = require('react');
const d3 = require('d3');

// class defining the pixel pad and explanation
class NeuralNetworkClassification extends React.Component {

    static inputData = new Array()

    constructor() {
        super()
    }

    componentDidMount() {

        var gridDataArray = this.gridData();

        var mainDiv = d3.select(this.refVisNN)
        // .attr("height", "100")
        // .attr("id", "mainDiv")

        // console.log(gridDataArray);
        var grid = mainDiv
            .append("svg")
            .attr("width", "15%")
            .attr("height", "100%")
            .attr("id", "inputGrid")

        var row = grid.selectAll(".row")
            .data(gridDataArray)
            .enter().append("g")
            .attr("width", "30%")
            .attr("class", "row");

        var column = row.selectAll(".square")
            .data(function (d) { return d; })
            .enter().append("rect")
            .attr("class", "square")
            .attr("x", function (d) { return d.x; })
            .attr("y", function (d) { return d.y; })
            .attr("width", function (d) { return d.width; })
            .attr("height", function (d) { return d.height; })
            .style("fill", "#ECECF4")
            .style("stroke", "#222")
            .on('click', function (d) {
                // console.log("onClick detected")
                d.click = !d.click;
                if (d.click) {
                    d3.select(this).style("fill", "#2C93E8");
                    NeuralNetworkClassification.inputData[d.index] = 1;
                } else {
                    d3.select(this).style("fill", "#ECECF4");
                    NeuralNetworkClassification.inputData[d.index] = 0;
                }
            });


        var instructionSVG = mainDiv
            .append("svg")
            .attr("width", "85%")
            .attr("height", "100%")
            .attr("id", "instructionSVG")

        var instructionDataOnStart = [{ text: "Please enter a number into the pixel pad.", x: 0, y: 15 },
        { text: "After that click the \"draw Neural Network\" button.", x: 0, y: 35 },
        { text: "The network used for classification will be shown below.", x: 0, y: 55 }];

        var instruction = instructionSVG.selectAll("text").enter()
            .data(instructionDataOnStart)
            .enter()
            .append("text")
            .text(function (d) { return d.text })
            .attr("x", function (d) { return d.x })
            .attr("y", function (d) { return d.y })
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("text-anchor", "left")
            .attr("id", "instruction")
    }


    gridData() {
        var data = new Array();
        var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
        var ypos = 1;

        var width = 20;
        var height = 20;

        var click = false;

        var numberOfRows = 5;
        var numberOfColumns = 3

        var index = 0;

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
                    click: click,
                    index: index
                })
                // increment the x position. I.e. move it over by 50 (width variable)
                xpos += width;
                index++;
                NeuralNetworkClassification.inputData.push(0)
            }
            // reset the x position after a row is complete
            xpos = 1;
            // increment the y position for the next row. Move it down 50 (height variable)
            ypos += height;
        }
        return data;
    }
    render () {
        return (
            <div className='NumberMatrix'>
                <div ref={refVis => (this.refVisNN = refVis)}>
                </div>
            </div>
        )
    }

}

export default NeuralNetworkClassification;