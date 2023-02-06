import React, { useEffect, useState, useRef } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

export default function Footer() {

    let date = new Date().getFullYear();

    return (
        <Container fluid className="footer">
            <p>© Blog App {date}</p>
        </Container>
    );
}
