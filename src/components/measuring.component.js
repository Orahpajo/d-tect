import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import MeasureMap from './measuremap.component';
import { headingDistanceTo } from 'geolocation-utils'

export default class Measuring extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {
                lat: 51.960667,
                lng: 7.628,
            },
            measureValues: [[]]
        };
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

        navigator.geolocation.getCurrentPosition(this.updatePosition,
            (error) => console.log(JSON.stringify(error)))
        navigator.geolocation.watchPosition(this.updatePosition,
            (error) => console.log(JSON.stringify(error)),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 1 }
        );
    }

    updatePosition = (position) => {
        console.log('geolocation ' + position.coords.latitude + ',' + position.coords.longitude);
        this.setState({
            location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
        });
        this.updateMeasureValues();
    }

    MeasuredUnits = () => {
        if (!this.state.operation)
            return <h2>Messung:</h2>;

        let pointNumber = 0;
        let measuringNumber = 0;
        const unit = this.state.operation.measure_points[pointNumber].measurings[measuringNumber].unit;
        const measuredUnits = this.state.measureValues[pointNumber][measuringNumber] + ' ' + unit;
        return <h2>Messung:  {measuredUnits}</h2>;

    }

    Odor = () => {
        if (!this.state.operation)
            return <span/>;

        let pointNumber = 0;
        const odor = this.state.operation.measure_points[pointNumber].odor;
        if (odor.threshold < this.state.measureValues[pointNumber][odor.measuring_number])
            return <span>{odor.description}</span>;
        else
            return <span/>;
    }

    Precipitation = () => {
        if (!this.state.operation)
            return <span></span>;
        
        let pointNumber = 0;
        const precipitation = this.state.operation.measure_points[pointNumber].precipitation;
        if (precipitation.threshold < this.state.measureValues[pointNumber][precipitation.measuring_number])
            return <span>{ precipitation.description }</span>
        else 
            return <span/>
    }

    updateMeasureValues = () => {
        if (!this.state.operation)
            return;
        //TODO this must be done for every single measuring and accumulate the measure_point values. For now only one point on one measure device
        let pointNumber = 0;
        let measuringNumber = 0;
        const measurePoint = this.state.operation.measure_points[pointNumber];
        const measuring = measurePoint.measurings[measuringNumber];
        const location = measurePoint.location;
        const { distance } = headingDistanceTo(location, this.state.location);
        console.log('Distance to point: ' + distance);
        let measureValue = measuring.value / Math.max(1, distance / 50);
        measureValue = Math.round(measureValue * 1000) / 1000;
        const measureValues = [[measureValue]];
        this.setState({ measureValues })
    }

    render() {
        return (
            <Container>
                <MeasureMap location={this.state.location} zoom={17}></MeasureMap>
                <this.MeasuredUnits></this.MeasuredUnits>
                <this.Odor/>
                <p/>
                <this.Precipitation/>
            </Container>
        );
    }
}