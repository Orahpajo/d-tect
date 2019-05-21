import React, { Component } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

export default class Operation extends Component {

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
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

    onSubmit(e) {
        e.preventDefault();
        this.props.history.push('/'+this.state.operation_number);
    }
    render() {
        return (
            <div style={{marginTop: 10}}>
                <Container>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group controlId="formBasicOperationID">
                            <Form.Label>Geben Sie die Messauftragsnummer ein</Form.Label>
                            <Form.Control placeholder="Messauftragsnummer" />
                        </Form.Group>
                        <Button type="submit">
                            Los!
                        </Button>
                    </Form>
                </Container>
            </div>
        )
    }
}