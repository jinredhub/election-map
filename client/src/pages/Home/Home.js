import React, {Component} from 'react';
import './Home.css';
// import * as d3 from 'd3';

import Navbar from '../../components/Navbar/Navbar';
import ElectionMap from '../../components/ElectionMap/ElectionMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class Home extends Component {
    state = {
        isHamburgerMenuOpen: false,
    };

    componentDidMount(){ 
       
    }

    hamburgerMenuHandler = () =>{
        this.setState({
            isHamburgerMenuOpen: !this.state.isHamburgerMenuOpen
        });
    }

    render(){
        console.log('======================', this.state);

        return (
            <div className="Home">
                <Navbar 
                    clicked={this.hamburgerMenuHandler} 
                    isHamburgerMenuOpen={this.state.isHamburgerMenuOpen}
                />
                
                <section>
                    <div className='tabcontent'>
                        <ElectionMap />
                    </div>
                </section>
            </div>
          );
    }
}

export default Home;
