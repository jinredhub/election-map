import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const footer = (props) =>{

    return(
        <div className='Footer'>
            <div style={{padding: '0 0 30px 0'}}>
                <a className='btn github' href="https://github.com/jinredhub"><FontAwesomeIcon icon={['fab', 'github-alt']} color='black' /></a>
            </div>
            <p style={{color: 'white'}}>Jin Redmond</p>
        </div>
    )
}

export default footer;