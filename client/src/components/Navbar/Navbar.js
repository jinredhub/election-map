import React from 'react';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const navbar = (props) =>{
    const style={'display': 'none'};
    const isHamburgerMenuOpen = props.isHamburgerMenuOpen;

    if(isHamburgerMenuOpen){
        style.display = 'block';
    }
    return(
        <div className='Navbar'>
            <div className='desktop'>
                <div>
                    <a href="https://jinredhub.github.io/arpeggios/">Arpeggios</a>
                    <a href="https://jinredhub.github.io/daw/">DAW</a>            
                    <a href="https://jinredhub.github.io/us-map-covid-19/" className='active'>Covid Map</a>  
                </div>               
            </div>
            <div className='mobile'>
                <div className='mobildLinks' style={style}>
                    <a href="https://jinredhub.github.io/arpeggios/">Arpeggios</a>
                    <a href="https://jinredhub.github.io/daw/">DAW</a>            
                    <a href="https://jinredhub.github.io/us-map-covid-19/" className='active'>Covid Map</a>
                </div>
                <a href="#" className='hamburgerIcon' aria-label="click to open mobile navigation menu" onClick={props.clicked}>
                    {/* <i className="fas fa-bars"></i> */}
                    <FontAwesomeIcon
                        icon={['fas', 'bars']}
                        size='sm'
                    />
                </a>
            </div>
        </div>
    )
}

export default navbar;