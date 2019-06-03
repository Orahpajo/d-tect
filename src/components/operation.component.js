import React, { Component } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';

export default class Operation extends Component {

    constructor(props) {
        super(props);

        this.onChangeOperationNumber = this.onChangeOperationNumber.bind(this);

        this.state = {
            operation_number: ''
        }
    }

    onChangeOperationNumber(e) {
        this.setState({
            operation_number: e.target.value
        });
    }

    WarningLabel = () => {
        if (this.state.warning)
            return <Alert variant='warning'>
                Bitte geben Sie eine gültige Messauftragsnummer ein!
                </Alert>
        else
            return null;
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.onSubmit(this.state.operation_number)
            .then((response) => {
                if (response.data)
                    this.props.history.push('/' + this.state.operation_number);
                else
                    this.setState({
                        warning: 'Bitte geben Sie eine gültige Messauftragsnummer ein.'
                    })
            })
            .catch(function (error) {
                console.log(`operation.component: Error while loading operation: ${JSON.stringify(error)}`);
            });
    }

    render() {
        return (
            <div style={{ marginTop: 10 }}>
                <Container>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group controlId="formBasicOperationID">
                            <Form.Label>Geben Sie die Messauftragsnummer ein</Form.Label>
                            <Form.Control placeholder="Messauftragsnummer" onChange={this.onChangeOperationNumber} />
                        </Form.Group>
                        <this.WarningLabel />
                        <Button type="submit">
                            Los!
                        </Button>
                    </Form>
                </Container>
            </div>
        )
    }
}