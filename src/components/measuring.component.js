import React, { Component } from 'react';
import { Container, Spinner, Dropdown, DropdownButton } from 'react-bootstrap';
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
            //Measured Values for each measure_point and device
            measureValues: [[{
                device: 'nose',
                measuredValue: 0,
                unit: 'ppm'
            }]],
            activeDevice: 'nose'
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
            return <Spinner animation="border" />;

        let pointNumber = 0;
        let measuringNumber = 0;

        //Here we need to accumulate the measurings for the selected device (measuringNumber) over all measure_points
        var accVal = 0;
        for (const measurePoint of this.state.measureValues) {
            const deviceMeasuring = measurePoint.find((measuring) => {
                console.log( 'comparing '+measuring.device+' to '+ this.state.activeDevice);
               return  measuring.device === this.state.activeDevice});
            if (deviceMeasuring)
                accVal += deviceMeasuring.measuredValue;
        }

        const measuring = this.state.measureValues[pointNumber][measuringNumber];
        const measuredUnits = accVal + ' ' + measuring.unit;
        return <h3>Messung:  {measuredUnits}</h3>;

    }

    Odor = () => {
        if (!this.state.operation)
            return <span />;

        let pointNumber = 0;
        const odor = this.state.operation.measure_points[pointNumber].odor;
        if (odor.threshold < this.state.measureValues[pointNumber][odor.measuring_number])
            return <span>{odor.description}</span>;
        else
            return <span />;
    }

    Precipitation = () => {
        if (!this.state.operation)
            return <span></span>;

        let pointNumber = 0;
        const precipitation = this.state.operation.measure_points[pointNumber].precipitation;
        if (precipitation.threshold < this.state.measureValues[pointNumber][precipitation.measuring_number])
            return <span>{precipitation.description}</span>
        else
            return <span />
    }

    updateMeasureValues = () => {
        if (!this.state.operation)
            return;
        //TODO this must be done for every single measuring
        var measureValues = [];
        for (const measurePoint of this.state.operation.measure_points) {
            let measuringNumber = 0;
            const measuring = measurePoint.measurings[measuringNumber];
            const location = measurePoint.location;
            const { distance } = headingDistanceTo(location, this.state.location);
            console.log('Distance to point: ' + distance);
            let measuredValue = measuring.value / Math.max(1, distance / 50);
            measuredValue = Math.round(measuredValue * 1000) / 1000;

            measureValues.push([{
                device: measuring.device,
                measuredValue,
                unit: measuring.unit
            }]);
        }
        console.log(measureValues);
        this.setState({ measureValues })
    }

    DeviceChooser = () => {
        return <div className='DeviceChooser' >
            <h2>{this.state.activeDevice}</h2>
            <DropdownButton id="dropdown-basic-button" title="Gerät wechseln">
                <this.DeviceChooserItem />
            </DropdownButton>
        </div>
    }

    DeviceChooserItem = () => {
        return this.state.measureValues.map((measurePoint) =>
            measurePoint.map((measuring) =>
                <Dropdown.Item key={measuring.device} onClick={this.onChooseDevice.bind(this, measuring.device)} active={measuring.device === this.state.activeDevice} >
                    {measuring.device}
                </Dropdown.Item>
            )
        );
    }

    onChooseDevice = (event) => {
        console.log('Setting active device to ' + event);
        this.setState({
            activeDevice: event
        });
    }

    render() {
        return (
            <Container>
                <MeasureMap location={this.state.location} zoom={17}></MeasureMap>
                <p />
                <this.DeviceChooser />
                <this.MeasuredUnits />
                <this.Odor />
                <p />
                <this.Precipitation />
            </Container>
        );
    }
}