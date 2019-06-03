import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Navbar } from 'react-bootstrap';
import Operation from './components/operation.component';
import Measuring from './components/measuring.component';
import axios from 'axios';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {};
  }
  async onSubmit(operation_number) {
    const url = process.env.REACT_APP_BACKEND_URL;
    const response = await axios.get(url + operation_number);
    if (response.data) {
      this.setState({
        operation: response.data
      });
      console.log('operation.component: operation loaded: ');
      console.log(this.state.operation);
    }
    return response;
  }

  render() {
    return (
      <Router>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
        <div className="container">
          <Navbar bg='light' expand='lg'>
            <Link to='/' className='navbar-brand'>d-tect</Link>
          </Navbar>
        </div>
        <Route path="/" exact render={(props) => <Operation {...props} operation={this.state.operation} onSubmit={this.onSubmit} />} />
        <Route path="/:operation_number"
          render={(props) => <Measuring {...props} operation={this.state.operation} />} />
      </Router>
    );
  }
}
