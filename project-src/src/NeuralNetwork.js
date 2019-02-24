import NeuralNetworkClassification from './NeuralNetworkClassification'; //Number Matrix
import Button from './Button';
import data from './nn.json'
import style from './styles.css'
const React = require('react');
const d3 = require('d3');



// class defining the neural network
class NeuralNetwork extends React.Component {

    dataFromNeuralNetworkClassification

    componentDidMount() {
//node, props
        // data from input
        this.dataFromNeuralNetworkClassification = NeuralNetworkClassification.inputData;

        var width = 960,
            height = 654


        // label for the button
        var data = [{ label: "Draw Neural Network", x: width / 5, y: 50 }];

        // save the link to current object, to hande overloaded this inside embedded methods

        //var objs = this;

        // initialize button
        var button = Button.button()
            .on('press', (d, i) => { this.draw(svg, width, height, this.refVis) })
        // .on('release', function (d, i) { console.log("Released", d, i, this.parentNode) });

        // Add buttons
        var buttons = d3.select(this.refVis)
            .append("svg")
            .attr("width", width / 2)
            .attr("height", height / 8)
            .style("display", "block")
            .selectAll('.button')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'button')
            .call(button);

        // add svg for the neural network
        var svg = d3.select(this.refVis).append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("id", "nn");
    }

    // draw neural network into the given svg with the given style
    draw(svg, width, height, node) {

        var instructionDataOnDrawNetwork = [{ text: "You can see how the network classified your input below.", x: 0, y: 15 },
        { text: "Deeper blue color marks more probable classification result", x: 0, y: 35 },
        { text: "Hover over circles to see additional information.", x: 0, y: 55 }];

        // update instructions on button click
        var index = 0;
        var text = d3.selectAll('svg text').each(function (d, i) {
            if (index < 3) {
                d3.select(this).text(instructionDataOnDrawNetwork[index].text);
            }
            index++;
        })

        var nodeSize = 20;

        var nodes = data.nodes;

        // add nodes from the input grid to the nodes from predefined file
        var indexForInputayer = 0;
        this.dataFromNeuralNetworkClassification.forEach(function (d) {
            if (d == 0) {
                nodes.push({ "label": "i" + indexForInputayer, "layer": 1, color: "#ECECF4", id: indexForInputayer, nodeSize: nodeSize, "dx": -5, "dy": 5 })
            } else {
                nodes.push({ "label": "i" + indexForInputayer, "layer": 1, color: "#2C93E8", id: indexForInputayer, nodeSize: nodeSize, "dx": -5, "dy": 5 })
            }
            indexForInputayer++
        })

        // get network size
        var netsize = {};
        nodes.forEach(function (d) {
            if (d.layer in netsize) {
                netsize[d.layer] += 1;
            } else {
                netsize[d.layer] = 1;
            }
            d["lidx"] = netsize[d.layer];
        });

        // calc distances between nodes
        var largestLayerSize = Math.max.apply(
            null, Object.keys(netsize).map(function (i) { return netsize[i]; }));

        var xdist = width / Object.keys(netsize).length,
            ydist = height / largestLayerSize + 20;

        // create node locations
        nodes.map(function (d) {

            // if the nodes are from the 
            if (d.layer == 1) {
                d["x"] = xdist * (d.id % 3) / 5 + 50;
                d["y"] = ydist * ~~(d.id / 3) + 150;

            } else {
                d["x"] = (d.layer - 0.5) * xdist;
                d["y"] = (d.lidx - 0.5) * ydist + 100;
            }
        });

        // autogenerate links
        var links = [];
        nodes.map(function (d, i) {
            for (var n in nodes) {
                if (d.layer + 1 == nodes[n].layer) {
                    links.push({ "source": parseInt(i), "target": parseInt(n), "value": 1 })
                }
            }
        }).filter(function (d) { return typeof d !== "undefined"; });

        // draw links
        var link = svg.selectAll(".link")
            .data(links)
            .enter().append("line")
            .attr("class", "link")
            .attr("x1", function (d) { return nodes[d.source].x; })
            .attr("y1", function (d) { return nodes[d.source].y; })
            .attr("x2", function (d) { return nodes[d.target].x; })
            .attr("y2", function (d) { return nodes[d.target].y; })
            .style("stroke-width", function (d) { return Math.sqrt(d.value); })

        // draw nodes
        var node = svg.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
        var circle = node.append("circle")
            .attr("class", "node")
            .attr("r", function (d) { return d.nodeSize; })
            .style("fill", function (d) { return d.color; })
            .on('mouseover', function (d, i) {
                // apply the function only on the elements of the hidden layer
                if (d.layer == 2 || d.layer == 3) {
                    d3.selection.prototype.moveToFront = function () {
                        return this.each(function () {
                            this.parentNode.appendChild(this);
                        });
                    };

                    // select the corresponding image
                    var imagename = "upper_o";
                    if (d.label == ". |") {
                        imagename = "right_I"
                    } else if (d.label == "_") {
                        imagename = "lower"
                    } else if (d.label == "o") {
                        // imagename = "lower_o"
                        imagename = "lower_o_9"
                    } else if (d.label == "| .") {
                        // imagename = "left_I"
                        imagename = "left_I_9"
                    } else if (d.label == "^") {
                        imagename = "upper"
                    } else if (d.label == "9") {
                        imagename = "c9_9"
                    } else if (d.label == "8") {
                        imagename = "c8_9"
                    } else if (d.label == "2") {
                        imagename = "c2_9"
                    } else if (d.label == "0") {
                        imagename = "c0_9"
                    }

                    // add pattern if there this one does not already exist
                    if (d3.select("#" + imagename)["_groups"][0][0] == null) {
                        var image = d3.select(this.parentNode)
                            .append("pattern")
                            .attr("id", imagename)
                            .attr("class", "svg-image")
                            .attr("x", "0")
                            .attr("y", "0")
                            .attr("height", "1")
                            .attr("width", "1")
                            .append("image")
                            .attr("x", "25")
                            .attr("y", "25")
                            .attr("height", "150px")
                            .attr("width", "150px")
                            .attr("xlink:href", process.env.PUBLIC_URL + "images/" + imagename + ".png")
                    }

                    // zoom in
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('r', 100)
                        .style("fill", "url(#" + imagename + ")")
                        .style("stroke", "black")
                        .style("stroke-width", 0.25)
                        

                    // overlap other nodes
                    d3.select(this.parentNode)
                        .moveToFront()
                }
            })
            .on('mouseout', function (d, i) {
                // return the mouseover'd element
                // to being smaller and black
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr('r', function (d) { return d.nodeSize; })
                    .style("fill", function (d) { return d.color; })
            })

        // move text closer to the corresponding image part
        node.append("text")
            .attr("dx", function (d) { return d.dx; })
            .attr("dy", function (d) { return d.dy; })
            .text(function (d) { return d.label; });
    }
    render () {
        return (
            <div className='Main-container'>
                <NeuralNetworkClassification/> { /*Number Matrix*/}
                <div ref={refVis => (this.refVis = refVis)}>
                </div>

            </div>
        )
    }
}

export default NeuralNetwork;