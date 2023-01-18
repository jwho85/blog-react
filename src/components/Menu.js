import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./utils/firebase";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

export default function Menu() {

    const [user, loading, error] = useAuthState(auth);

    return (
        <Navbar expand="lg" sticky="top" className="nav-bar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="logo-text">Blog App</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link>Logged in as: {user?.email}</Nav.Link>
                        <Nav.Link as={Link} to={"/dashboard"}>View Posts</Nav.Link>
                        <Nav.Link as={Link} to={"/create-post"}>Create Post</Nav.Link>
                        <Nav.Link onClick={logout}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}