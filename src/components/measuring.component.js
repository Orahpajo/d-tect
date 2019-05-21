import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';

export default class Measuring extends Component {
    constructor(props) {
        super(props);
        this.state = {operation: {}};
    }

    componentDidMount() {
        axios.get('http://localhost:4000/operations/'+this.props.match.params.operation_number)
            .then(response => {
                this.setState({ operation: response.data });
                console.log('operation loaded: '+this.state.operation.operation_number);
            })
            .catch(function (error){
                console.log(error);
            })
    }
    render() {
        return (
            <Container>
                <h2>Messung: {this.state.operation.operation_number}</h2>
            </Container>
        );
    }
}