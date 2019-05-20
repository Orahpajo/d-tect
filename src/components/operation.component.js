import React, { Component } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

export default class Operation extends Component {
    render() {
        return (
            <div style={{marginTop: 10}}>
                <Container>
                    <Form>
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