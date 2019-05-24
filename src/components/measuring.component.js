import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import MeasureMap from './measuremap.component';
import {headingDistanceTo} from 'geolocation-utils'

export default class Measuring extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: { //London
                lat: 51.505,
                lng: -0.09,
            },
            operation: {}
        };
    }


    componentDidMount() {
        axios.get('http://localhost:4000/operations/' + this.props.match.params.operation_number)
            .then(response => {
                this.setState({
                    operation: response.data,
                    measuredUnits: this.calculateMeasuredUnits(response.data)
                });
                console.log('operation loaded: ');
                console.log(this.state.operation);
            })
            .catch(function (error) {
                console.log(error);
            });


        navigator.geolocation.getCurrentPosition((position) => { //watchPosition
            console.log('geolocation '+position.coords.latitude+','+position.coords.longitude)
            this.setState({
                location: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            });
        });
    }

    calculateMeasuredUnits(op) {
        const measurePoint = op.measure_points[0];
        const measuring = measurePoint.measurings[0];
        const unit = measuring.unit;
        const location = measurePoint.location;
        console.log(this.state.location);
        const { distance } = headingDistanceTo(location, this.state.location);
        console.log('disance '+distance);
        const measureValue = measuring.value / Math.max(1,distance); 
        return measureValue + ' ' + unit;
    }

    render() {
        return (
            <Container>
                <MeasureMap location={this.state.location} zoom={13}></MeasureMap>
                <h2>Messung:  {this.state.measuredUnits}</h2>
            </Container>
        );
    }
}