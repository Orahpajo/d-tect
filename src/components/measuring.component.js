import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import MeasureMap from './measuremap.component';
import { headingDistanceTo } from 'geolocation-utils'

export default class Measuring extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: { //London
                lat: 51.505,
                lng: -0.09,
            }
        };

        this.MeasuredUnits = this.MeasuredUnits.bind(this);
    }


    componentDidMount() {
        axios.get('http://localhost:4000/operations/' + this.props.match.params.operation_number)
            .then(response => {
                this.setState({
                    operation: response.data
                });
                console.log('operation loaded: ');
                console.log(this.state.operation);
            })
            .catch(function (error) {
                console.log(error);
            });


        navigator.geolocation.getCurrentPosition((position) => { //watchPosition
            console.log('geolocation ' + position.coords.latitude + ',' + position.coords.longitude)
            this.setState({
                location: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            });
        });
    }

    MeasuredUnits() {
        if (this.state.operation) {
            const measurePoint = this.state.operation.measure_points[0];
            const measuring = measurePoint.measurings[0];
            const unit = measuring.unit;
            const location = measurePoint.location;
            const { distance } = headingDistanceTo(location, this.state.location);
            console.log('Distance to point: '+ distance);
            let measureValue = measuring.value / Math.max(1, distance / 50);
            measureValue = Math.round(measureValue * 1000) / 1000;
            const measuredUnits = measureValue + ' ' + unit;
            return <h2>Messung:  {measuredUnits}</h2>;
        } else return <h2>Messung:</h2>;
    }

    render() {
        return (
            <Container>
                <MeasureMap location={this.state.location} zoom={17}></MeasureMap>
                <this.MeasuredUnits></this.MeasuredUnits>

            </Container>
        );
    }
}