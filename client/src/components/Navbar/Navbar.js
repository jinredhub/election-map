import React from 'react';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const navbar = (props) =>{
    const style={'display': 'none'};
    const isHamburgerMenuOpen = props.isHamburgerMenuOpen;

    const links = [
        {'href': 'https://jinredhub.github.io/arpeggios/', 'name': 'Arpeggios'},
        {'href': 'https://jinredhub.github.io/daw/', 'name': 'DAW'},
        {'href': 'https://jinredhub.github.io/us-map-covid-19/', 'name': 'Covid Map'},
        {'href': 'https://election-map.up.railway.app/', 'name': 'Election Map'},
    ];

    const displayLinks = links.map((val, i) =>{
        return <a href={val.href} className={val.name === props.activeLink ? 'active' : ''} key={i}>{val.name}</a>;
    });

    if(isHamburgerMenuOpen){
        style.display = 'block';
    }
    
    return(
        <div className='Navbar'>
            <div className='desktop'>
                <div>
                    {displayLinks}
                </div>               
            </div>
            <div className='mobile'>
                <div className='mobildLinks' style={style}>
                    {displayLinks}
                </div>
                <button className='hamburgerIcon' aria-label="click to open mobile navigation menu" onClick={props.clicked}>
                    <FontAwesomeIcon
                        icon={['fas', 'bars']}
                        size='sm'
                    />
                </button>
            </div>
        </div>
    )
}

export default navbar;