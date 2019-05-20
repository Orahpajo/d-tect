import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Navbar } from 'react-bootstrap';
import Operation from './components/operation.component';

function App() {
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
      <Route path="/" exact component={Operation} />
    </Router>
  );
}

export default App;
