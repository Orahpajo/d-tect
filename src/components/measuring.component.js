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
            activeDevice: 'nose',
            activeUnit: 'ppm'
        };
    }


    componentDidMount() {
        const url = process.env.REACT_APP_BACKEND_URL;  
        console.log(`backend is ${url}${this.props.match.params.operation_number}`);
        const agent = new https.Agent({  
            rejectUnauthorized: false //trust my self signed certificate
          });
        axios.get(url + this.props.match.params.operation_number, { httpsAgent: agent })
            .then(response => {
                this.setState({
                    operation: response.data
                });
                console.log('operation loaded: ');
                console.log(this.state.operation);
            })
            .catch(function (error) {
                console.log(`Error while loading operation: ${JSON.stringify(error)}`);
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

        //Here we need to accumulate the measurings for the selected device (measuringNumber) over all measure_points
        var accVal = 0;
        for (const measurePoint of this.state.measureValues) {
            const deviceMeasuring = measurePoint.find((measuring) => measuring.device === this.state.activeDevice);
            if (deviceMeasuring)
                accVal += deviceMeasuring.measuredValue;
        }
        return <h3>Messung: {accVal + ' ' + this.state.activeUnit}</h3>;
    }

    Surroundings = () => {
        if (!this.state.operation)
            return <span />;

        const result = [];
        for (const measurePoint of this.state.operation.measure_points) {
            for (const feature of measurePoint.surroundings) {
                //find the measured value at the current location, that belong the the featured device
                const refMeasuring = this.state.measureValues.find((measuring) => measuring.device === feature.device)[0];
                if (refMeasuring.measuredValue >= feature.threshold) {
                    result.push(<p key={feature.description}>{feature.description}</p>)
                }
            }
        }

        return result;
    }

    updateMeasureValues = () => {
        if (!this.state.operation)
            return;
        var measureValues = [];
        for (const measurePoint of this.state.operation.measure_points) {
            const measurePointValues = [];
            for (const measuring of measurePoint.measurings) {
                const location = measurePoint.location;
                const { distance } = headingDistanceTo(location, this.state.location);
                console.log('Distance to point: ' + distance);
                let measuredValue = measuring.value / Math.max(1, distance / 50);
                measuredValue = Math.round(measuredValue * 1000) / 1000;

                measurePointValues.push({
                    device: measuring.device,
                    measuredValue,
                    unit: measuring.unit
                });
            }
            measureValues.push(measurePointValues);
        }
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
                <Dropdown.Item key={measuring.device} onClick={this.onChooseDevice.bind(this, measuring)} active={measuring.device === this.state.activeDevice} >
                    {measuring.device}
                </Dropdown.Item>
            )
        );
    }

    onChooseDevice = (event) => {
        console.log('Setting active device to ' + JSON.stringify(event));
        this.setState({
            activeDevice: event.device,
            activeUnit: event.unit
        });
    }

    render() {
        return (
            <Container>
                <MeasureMap location={this.state.location} zoom={17}></MeasureMap>
                <p />
                <this.DeviceChooser />
                <this.MeasuredUnits />
                <this.Surroundings />
            </Container>
        );
    }
}