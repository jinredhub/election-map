import React, {Component} from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import Home from './pages/Home/Home';

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faCheck, faMugHot, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons';

library.add(faBars, faCheck, faGithubAlt, faMugHot, faCircleNotch);


class App extends Component {

    render(){
        return (
            <BrowserRouter>
                <div className="App">
                    <Route path='/' exact component={Home}/>
                </div>
            </BrowserRouter>
          );
    }
}

export default App;
