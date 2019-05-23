import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import MeasureMap from './measuremap.component';
import {
    toLatLon, toLatitudeLongitude, headingDistanceTo, moveTo, insidePolygon
} from 'geolocation-utils'

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
        //TODO we get the correct geolocation but the map is rendered with defaults, as well es the measuring calculation
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

        const measureValue = measuring.value / (distance); //TODO min (distance,1)
        return measureValue + ' ' + unit;
    }

    render() {
        return (
            <Container>
                <MeasureMap location={this.state.location}></MeasureMap>
                <h2>Messung:  {this.state.measuredUnits}</h2>
            </Container>
        );
    }
}