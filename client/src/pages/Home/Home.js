import React, {Component} from 'react';
import './Home.css';

import Navbar from '../../components/Navbar/Navbar';
import ElectionMap from '../../components/ElectionMap/ElectionMap';
import Footer from '../../components/Footer/Footer';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


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
        // console.log('======================', this.state);

        return (
            <div className="Home">
                <Navbar 
                    clicked={this.hamburgerMenuHandler} 
                    isHamburgerMenuOpen={this.state.isHamburgerMenuOpen}
                    activeLink='Election Map'
                />
                
                <section>
                    <div className='tabcontent'>
                        <ElectionMap />
                    </div>
                </section>

                <Footer />
            </div>
          );
    }
}

export default Home;
