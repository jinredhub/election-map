import React, {Component} from 'react';
import './ElectionMap.css';
import joeImg from '../../assets/bidenj.png';
import trumpImg from '../../assets/trumpd.png';

import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BarChart from '../BarChart/BarChart';

class electionMap extends Component {
    chartRef = React.createRef();

    state = {
        democratCount: 0,
        republicanCount: 0,
        democratVotes: 0,
        republicanVotes: 0,
        barchartdata: [],
        isStateDetailPanelVisible: false,
        tableContent: [],
    };

    componentDidMount(){
        console.log('component did mount, electionMap');
        this.createMap();    

        // add event listner
        window.addEventListener('resize', this.createMap.bind(this));
    }

    componentWillUnmount(){
        // perform any necessary clanup before this componetn is unmounted and destroyed
        window.removeEventListener('resize', this.createMap.bind(this));
    }
    
    createMap = () =>{
        // move tooltip to right for resize
        this.setState({
            stateDetailLeft: 0,
        });
        const accessToRef = this.chartRef.current;

        // remove svg for rerendering on resize
        d3.select(accessToRef).select('svg').remove();

        const mapContainerEl = document.querySelector('.mapContainer');

        const mapWidth = parseFloat(getComputedStyle(mapContainerEl).width.replace('px', ''));
        const mapHeight = mapWidth * 0.6;

        const worldMapSvg = d3.select(accessToRef)
          .append('svg')
          .attr('width', mapWidth)
          .attr('height', mapHeight)
          .append('g');

        const files = [
            d3.json('/myD3Files/counties-10m.json'), 
            d3.json('/myD3Files/president.json'),
            d3.json('/myD3Files/state_name.json'),
        ];
        
        const projection = d3.geoAlbersUsa()
            .translate([mapWidth / 2, mapHeight / 2])
            .scale(mapWidth);

        const worldMapPath = d3.geoPath()
            .projection(projection);

        const that = this;

        Promise.all(files.map(url => (url))).then(function(values){
            console.log('values: ', values);

            const tableInformation = values[1].data.races.map(val =>{
                const joeBidenData = val.candidates.filter(candidate =>{
                    return candidate.candidate_key === "bidenj";
                });

                const donaldTrumpData = val.candidates.filter(candidate =>{
                    return candidate.candidate_key === "trumpd";
                });

                return {
                    stateName: val.state_name,
                    joeBiden: joeBidenData,
                    doanldTrump: donaldTrumpData,
                    reportingValue: val.reporting_value,
                    winner: val.candidates[0].candidate_key,
                };
            })

            that.setState({
                democratCount: values[1].data.party_control[1].parties.democrat.count,
                republicanCount: values[1].data.party_control[1].parties.republican.count,
                democratVotes: values[1].data.party_control[1].parties.democrat.votes,
                democratPercent: values[1].data.party_control[1].parties.democrat.percent,
                republicanVotes: values[1].data.party_control[1].parties.republican.votes,
                republicanPercent: values[1].data.party_control[1].parties.republican.percent,
                tableContent: tableInformation,
            });

            // topojson feature converts
            // always pass it data, then data.objects.something
            const states = topojson.feature(values[0], values[0].objects.states).features;

            console.log('states: ', states);

            // election, state:               values[1].data.races[i].state_name === 'California';
            // election, candidates in state: values[1].data.races[i].candidates
            states.forEach(function(state_value, state_index){
                values[1].data.races.forEach(function(race_value, race_index){
                    values[2].forEach(function(stateName_value, stateName_index){
                        if(state_value.properties.name === stateName_value.name){
                            states[state_index].properties.abbreviation = stateName_value.abbreviation;
                        }

                        if(state_value.properties.name === race_value.state_name){
                            states[state_index].properties.candidates = race_value.candidates;
                            states[state_index].properties.electoralVotes = race_value.electoral_votes;
                            states[state_index].properties.reportingValue = race_value.reporting_value;
                        }
                    });
                });
            });

            console.log('updated states: ', states);
    
            // add a path for each state
            worldMapSvg.selectAll('.state')
                .data(states)
                .enter()
                .append('path')
                .attr('class', 'state')
                .attr('d', worldMapPath)
                .attr('stroke', 'white')
                .attr('stroke-width', 1)
                .attr('fill', function(d){
                    // console.log('d: ', d);
                    // Puerto Rico, American Samoa, United States Virgin Islands, Commonwealth of the Northern Mariana Islands, Guam
                    if(!d.properties.candidates){
                        return 'yellow';
                    }

                    const partyId = d.properties.candidates[0].party_id;
                    if(partyId === 'democrat'){
                        return '#0471E6';
                    }
                    else if(partyId === 'republican'){
                        return '#DE3535';
                    }
                    else{
                        return 'green';
                    }
                })
                .on('mouseover', function(d){
                    // const svgRect = document.querySelector('#renderMap').getBoundingClientRect();
                    // const documentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    console.log('check d: ', d);

                    const candidateArray = [];
                    d.properties.candidates.forEach((val, i) => {
                        if(i <  6){
                            candidateArray.push({
                                index: val.last_name === 'None of these candidates' ? 'none' : val.last_name,
                                value: val.percent,
                                partyId: val.party_id,
                            });
                        }
                    });

                    const x = d3.event.pageX;
                    const y = d3.event.pageY;

                    const tooltipWidth = document.querySelector('.tooltip').offsetWidth;
                    const tooltipHeight = document.querySelector('.tooltip').offsetHeight;

                    that.setState({
                        barchartdata: candidateArray,
                        hoverStateName: d.properties.name,
                        isStateDetailPanelVisible: true,
                        stateDetailLeft: x - (tooltipWidth / 2) + 'px',
                        stateDetailTop: y - (tooltipHeight + 24) + 'px',
                        electoralVotes: d.properties.electoralVotes,
                        reportingValue: d.properties.reportingValue,
                    });
                })
                .on('mouseout', function(d){
                    that.setState({
                        isStateDetailPanelVisible: false,
                    });
                });

            worldMapSvg.selectAll('.stateName')
                .data(states)
                .enter()
                .append('text')
                .attr('class', 'stateName')
                .text(function(d){
                    return d.properties.abbreviation;
                })
                .attr('x', function(d){
                    return worldMapPath.centroid(d)[0] ? worldMapPath.centroid(d)[0] : 0;
                })
                .attr('y', function(d){
                    return worldMapPath.centroid(d)[1] ? worldMapPath.centroid(d)[1] : 0;
                })
                // .attr('text-anchor', 'middle')
                .attr('font-size', '9px')
                .attr('font-weight', 'bold')
                .attr('fill', function(d){
                    const states = 'Hawaii, Vermont, Massachusetts, Rhode Island, New Jersey, Delaware';
                    if(states.includes(d.properties.name)){
                        return 'black';
                    }
                    else{
                        return 'white';
                    }
                })
                .attr('dx', function(d){
                    if( d.properties.name === 'Hawaii'){
                        return '2%';
                    }
                    else if(d.properties.name === 'Vermont'){
                        return '-1%';
                    }
                    else if(d.properties.name === 'Massachusetts'){
                        return '4%';
                    }
                    else if(d.properties.name === 'Rhode Island'){
                        return '2%';
                    }
                    else if(d.properties.name === 'New Jersey'){
                        return '2%';
                    }
                    else if(d.properties.name === 'Delaware'){
                        return '2%';
                    }
                    else if(d.properties.name === 'Florida'){
                        return '1%';
                    }
                    else if(d.properties.name === 'Louisiana'){
                        return '-0.8%';
                    }
                    else{
                        return 0;
                    }
                })
                .attr('dy', function(d){
                    if( d.properties.name === 'Hawaii'){
                        return '-1%';
                    }
                    else if(d.properties.name === 'Vermont'){
                        return '-3%';
                    }
                    else if(d.properties.name === 'Rhode Island'){
                        return '3%';
                    }
                    else if(d.properties.name === 'New Jersey'){
                        return '2%';
                    }
                    else if(d.properties.name === 'Delaware'){
                        return '2%';
                    }
                    else{
                        return '.35em';
                    }
                })
                .style('pointer-events', 'none');
        });  
    }

    numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    render(){
        console.log('electoinMap==========================', this.state);

        const balanceHeader = <div className='headerDiv'>
            <div className='balanceCount'>
                <div className='disp-flex flex-dir-col' style={{color: '#0471E6', fontWeight: 'bold'}}>
                    <span style={{fontSize: '48px'}}>{this.state.democratCount}</span>
                    <span style={{fontSize: '18px', paddingBottom: '8px'}}>BIDEN <FontAwesomeIcon icon='check' color='#6DB65B' /></span>
                </div>
                <div style={{color: '#777'}}>270 to win</div>
                <div className='disp-flex flex-dir-col' style={{color: '#DE3535', fontWeight: 'bold', textAlign: 'end'}}>
                    <span style={{fontSize: '48px'}}>{this.state.republicanCount}</span>
                    <span style={{fontSize: '18px', paddingBottom: '8px'}}>TRUMP</span>
                </div>
            </div>
            <div className='balanceChartDiv'>
                <div className='middleBar'></div>
                <div style={{flex: `1 1 ${this.state.democratCount}%`, backgroundColor: '#0471E6'}}></div>
                <div style={{flex: `1 1 ${this.state.republicanCount}%`, backgroundColor: '#DE3535'}}></div>
            </div>
            <div className='disp-flex justify-content--space-between' style={{color: '#777'}}>
                <span className='votesAndPercentage'>{this.numberWithCommas(this.state.democratVotes)} votes ({this.state.democratPercent}%)</span>
                <span className='votesAndPercentage'>{this.numberWithCommas(this.state.republicanVotes)} votes ({this.state.republicanPercent}%)</span>
            </div>
        </div>;

        const tooltipStyle = {
            opacity: this.state.isStateDetailPanelVisible ? 1 : 0,
            left: this.state.stateDetailLeft,
            top: this.state.stateDetailTop,
        };
        
        const tooltip = <div className='tooltip' style={tooltipStyle}>
            <div className='detailHeader'>
                <span className='detailStateName'>{this.state.hoverStateName}</span>
                <span className='detailElectoralVotes'>{this.state.electoralVotes} Electorial Votes</span>
                <span className='detailReportingValue'>{this.state.reportingValue} IN</span>
            </div>
            <div style={{marginTop: '-10px'}}>
                <BarChart data={this.state.barchartdata} />
            </div>
        </div>;

        const tableContent = this.state.tableContent.map((val, i) =>{
            // console.log('table val: ', val);
            const winner = val.winner;

            return <tr key={i}>
                <td style={{fontWeight: '900', fontSize: '16px'}}>{val.stateName}</td>
                <td style={{fontWeight: '900', fontSize: '16px', backgroundColor: winner === 'bidenj' ? '#0471E6' : 'transparent', color: winner === 'bidenj' ? 'white' : 'black'}}><span style={{display: 'inline-block', width: '80px'}}>{winner === 'bidenj' ? <FontAwesomeIcon icon='check' color='white' /> : ''} {val.joeBiden[0].percent_display}%</span></td>
                <td style={{fontSize: '12px'}}>{this.numberWithCommas(val.joeBiden[0].votes)}</td>
                <td></td>
                <td style={{fontWeight: '900', fontSize: '16px', backgroundColor: winner === 'trumpd' ? '#DE3535' : 'transparent', color: winner === 'trumpd' ? 'white' : 'black'}}><span style={{display: 'inline-block', width: '80px'}}>{winner === 'trumpd' ? <FontAwesomeIcon icon='check' color='white' /> : ''} {val.doanldTrump[0].percent_display}%</span></td>
                <td style={{fontSize: '12px'}}>{this.numberWithCommas(val.doanldTrump[0].votes)}</td>
                <td></td>
                <td style={{fontSize: '12px'}} className='hide-tablet'>{val.reportingValue} in</td>
            </tr>;
        })

        return (
            <div className='ElectionMap'>
                {balanceHeader}

                <h1 className='mapTitle'>2020 Presidential Election Results</h1>
                <div className='mapDescription'>Hover over the map for details</div>

                <div className='mapContainer'>
                    <div ref={this.chartRef}></div>
                </div>

                {tooltip}

                <div style={{overflowX: 'auto'}}>
                    <table className='myTable'>
                        <thead>
                            <tr>
                                <th>States</th>
                                <th>
                                    <div className='joeImgContainer'>
                                        <img src={joeImg}  style={{width: '100%'}} />
                                        <div className='partyDemUnderImg'>
                                            DEM
                                        </div>
                                    </div>
                                    <br/>Percent
                                </th>
                                <th>Votes</th>
                                <th></th>
                                <th>
                                    <div className='trumpImgContainer'>
                                        <img src={trumpImg}  style={{width: '100%'}} />
                                        <div className='partyGopUnderImg'>
                                            GOP
                                        </div>
                                    </div>
                                    <br/>Percent
                                </th>
                                <th>Votes</th>
                                <th></th>
                                <th className='hide-tablet'>% in</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableContent}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default electionMap;
