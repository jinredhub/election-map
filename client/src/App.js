import React, {Component} from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import Home from './pages/Home/Home';

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faCheck } from '@fortawesome/free-solid-svg-icons';

library.add(faBars, faCheck);


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
