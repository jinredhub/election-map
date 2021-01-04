import React, {Component} from 'react';
import * as d3 from 'd3';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// let mySvg = null;
// let xScale = null;
// let xAxis = null;
// let yScale = null;
// let yAxis = null;

class barChart extends Component {
    // 1. create a ref for dom manipulation
    chartRef = React.createRef();

    state = {
    };

    chartMargin = {top: 20, right: 20, bottom: 30, left: 40};
    width3 = 200 - this.chartMargin.left - this.chartMargin.right;
    height3 = 100 - this.chartMargin.top - this.chartMargin.bottom;

    mySvg = null;

    xScale = null;

    xAxis = null;

    ///////////////////////////////////////////////////////////////
    // Original file, index.html in 57-D3
    // Put all the code above update in createSvg function
    // and put all the code in updateChart in updateChart function
    //////////////////////////////////////////////////////////////
    
    componentDidMount(){
        console.log('component did mount, create svg');
        this.createSvg();    
    }    

    componentDidUpdate(){
        console.log('component did update');
        this.updateChart(this.props.data);
    }

    createSvg = () =>{
        // 3. access it
        const accessToRef = this.chartRef.current;

        // const w = parseFloat(getComputedStyle(accessToRef).width.replace('px', ''));
        const w1 = accessToRef.getBoundingClientRect();
        console.log('w1: ', w1);
        const w2 = accessToRef.clientWidth;
        console.log('w2: ', w2);

        this.width3 = w2 - this.chartMargin.left - this.chartMargin.right;

        this.mySvg = d3.select(accessToRef)
            .append('svg')
            .attr('width', this.width3 + this.chartMargin.left + this.chartMargin.right)
            .attr('height', this.height3 + this.chartMargin.top + this.chartMargin.bottom)
            .append('g')
            .attr('transform', "translate(" + this.chartMargin.left + "," + this.chartMargin.top + ")");

        this.xScale = d3.scaleBand()
            // .domain(data3.map(function(d){ // min and max values of your input data
            //      return d.index;
            // }))
            .range([0, this.width3])  // container width is 300. Output values.
            .padding(.1)    // band.paddingOUter and band.paddingInner to 0.1 (use value between 0 ~ 1)
            .round(true);   // if band.round is enabled, the start and stop of each band will be integers

        // x axis
        this.xAxis = this.mySvg.append('g')
            .attr('transform', 'translate(0,' + this.height3 + ')')
            
        this.yScale = d3.scaleLinear()
            // .domain([0, d3.max(data3.map(function(d){
            //     return d.value;
            // }))])  // domain: input value: your data
            .range([this.height3, 0])    // output value: max, min
            .clamp(true);           // prevent going over the chart

        // y axis
        this.yAxis = this.mySvg.append('g')
            .attr('class', 'myYaxis');

    }

    updateChart = () =>{
        // x axis---------------------------------------------
        // d3.axisLeft axisBottom axisTop axisRight : constructs a new left-oriented axis generator for the given scale.
        // selection.call(): calls a function with this selection
        this.xScale.domain(this.props.data.map(function(d){
            return d.index;
        }));
        // this.xAxis.transition().duration(1000).call(d3.axisBottom(this.xScale));
        this.xAxis.transition().duration(1000).call(d3.axisBottom(this.xScale).tickFormat(function(d, i){
            // console.log('tick d:',d);
            // console.log('i: ', i);
            if(i === 0){
                return '✓ ' + d;
            }
            else{
                return d;
            }
        }));

        // rotate x-axis labels
        this.xAxis.selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-20)');

        // y axis--------------------------------------------
        // axis.tickFormat(): set the tick values explicitly
        // axis.ticks(): specify the number of ticks we would like. Default ticks for quantitative scales are multiples of 2, 5 and 10
        // Ex: if the domain is 0-100 and you want 4 ticks (0, 33.33, 66.66, 100) it will round up to 6 to give you 'pretty' numbers (0, 20, 40, 60, 80, 100)
        this.yScale.domain([0, d3.max(this.props.data, function(d){
            return d.value;
        })])
        .range([this.height3, 0])
        .clamp(true);
        this.yAxis.transition().duration(1000).call(d3.axisLeft(this.yScale).tickFormat(function(d){
            return d + '%';
        }).ticks(2));


        const selectionBar = this.mySvg.selectAll('.bar');
        const binding = selectionBar.data(this.props.data);

        const that = this;

        // update existing bar. (Already has data() function)
        binding.transition()
            .duration(1000)
            .attr('x', function(d){
                return that.xScale(d.index);
            })
            .attr('y', function(d){
                return that.yScale(d.value);
            })
            .attr('width', that.xScale.bandwidth())
            .attr('height', function(d){
                return that.height3 - that.yScale(d.value);
            })
            .attr('fill', function(d){
                if(d.partyId === "republican"){
                    return '#DE3535';
                }
                else if(d.partyId === "democrat"){
                    return '#0471E6';
                }
                else{
                    return '#595959';
                }
            });

        // enter new bar (add)
        binding.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d){
                return that.xScale(d.index);
            })
            .attr('y', function(d){
                return that.yScale(d.value);
            })
            .attr('width', that.xScale.bandwidth())
            .attr('height', function(d){
                return that.height3 - that.yScale(d.value);
            })
            .attr('fill', function(d){
                if(d.partyId === "republican"){
                    return '#DE3535';
                }
                else if(d.partyId === "democrat"){
                    return '#0471E6';
                }
                else{
                    return '#595959';
                }
            })
            .transition()
            .duration(1000)
            .style('opacity', 1);

        // exit bar (remove)
        binding.exit()
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove();

        // event listener
        // this.mySvg.selectAll('.bar').on('click', function(){
        //     console.log('clicked bar');
        //     // console.log('d3.mouse(congtainer): ', d3.mouse(this));
        //     // console.log('d3.event: ', d3.event);

        //     const id = this.getAttribute('data-id');
        // }); 
    }   

    render(){
        return (
            <div className='BarChart'>
                {/* 2. assign the ref to node */}
                <div ref={this.chartRef}></div>                
            </div>
        );
    }
}

export default barChart;
