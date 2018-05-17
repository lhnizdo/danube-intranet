import React, { Component } from 'react';
import Link from 'next/link';
import axios from 'axios';

const bolderUppercaseStyle = {
    fontWeight: 'bolder',
    textTransform: 'uppercase'
};

const linkStyle = {
    marginRight: 10,
    color: '#000000',
    textDecoration: 'none'
};

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
        }
    }
    componentDidMount() {
        axios.get('/is-authenticated').then(res => {
            this.setState({isAuthenticated: res.data.isAuthenticated});
        });
    }
    render() {
        return (<div id="header" style={{padding: 5, height: 30, backgroundImage: 'url(/static/header_background.png)', backgroundRepeat: 'repeat'}}>
            <div className="menu" style={{margin: 5, float: "left"}}>
                <Link href="/">
                    <a style={linkStyle}>
                        <span style={bolderUppercaseStyle}>Dukane</span>&nbsp;Project&nbsp;Manager
                    </a>
                </Link>
                <Link href="/applications">
                    <a style={linkStyle}>Applications</a>
                </Link>
                <Link href="/reports">
                    <a style={linkStyle}>Reports</a>
                </Link>
                <Link href="/users">
                    <a style={linkStyle}>Users</a>
                </Link>
            </div>
            <div className="menu" style={{margin: 5, textAlign: "right", float: "right"}}>
                {this.state.isAuthenticated ? (
                    <a style={linkStyle} href="/logout">Logout</a>) : (
                    <Link href="/login">
                        <a style={linkStyle}>Login</a>
                    </Link>
                )}
            </div>
        </div>);
    }
}

export default Header;