import React, {Component} from 'react';
import * as d3 from 'd3';

class barChart extends Component {
    chartRef = React.createRef();

    state = {
    };

    chartMargin = {top: 20, right: 20, bottom: 30, left: 40};
    width3 = 200 - this.chartMargin.left - this.chartMargin.right;
    height3 = 100 - this.chartMargin.top - this.chartMargin.bottom;

    mySvg = null;

    xScale = null;

    xAxis = null;
    
    componentDidMount(){
        // console.log('component did mount, create svg');
        this.createSvg();    
    }    

    componentDidUpdate(){
        // console.log('component did update');
        this.updateChart(this.props.data);
    }

    createSvg = () =>{
        const accessToRef = this.chartRef.current;

        const w1 = accessToRef.clientWidth;
        // console.log('w1: ', w1);

        this.width3 = w1 - this.chartMargin.left - this.chartMargin.right;

        this.mySvg = d3.select(accessToRef)
            .append('svg')
            .attr('width', this.width3 + this.chartMargin.left + this.chartMargin.right)
            .attr('height', this.height3 + this.chartMargin.top + this.chartMargin.bottom)
            .append('g')
            .attr('transform', "translate(" + this.chartMargin.left + "," + this.chartMargin.top + ")");

        this.xScale = d3.scaleBand()
            .range([0, this.width3])
            .padding(.1)
            .round(true);

        // x axis
        this.xAxis = this.mySvg.append('g')
            .attr('transform', 'translate(0,' + this.height3 + ')');
            
        this.yScale = d3.scaleLinear()
            .range([this.height3, 0])
            .clamp(true);

        // y axis
        this.yAxis = this.mySvg.append('g')
            .attr('class', 'myYaxis');

    }

    updateChart = () =>{
        // x axis---------------------------------------------
        this.xScale.domain(this.props.data.map(function(d){
            return d.index;
        }));
        // this.xAxis.transition().duration(1000).call(d3.axisBottom(this.xScale));
        this.xAxis.transition().duration(1000).call(d3.axisBottom(this.xScale).tickFormat(function(d, i){
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

        // update existing bar
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

        // enter new bar
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

        // exit bar
        binding.exit()
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove();

    }   

    render(){
        return (
            <div className='BarChart'>
                <div ref={this.chartRef}></div>                
            </div>
        );
    }
}

export default barChart;
