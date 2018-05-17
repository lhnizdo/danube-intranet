import React, { Component } from 'react';
import gql from 'graphql-tag';

import LayoutWithData from '../components/layout_with_data';
import Overview from "../components/overview";

import axios from 'axios';
import Link from 'next/link';

const usersQuery = gql`
    query usersQuery {
        users
    }
`;

const columns = [
    {
        className: "email",
        title: "E-mail",
    },
    {
        className: "first-name",
        title: "First name",
    },
    {
        className: "last-name",
        title: "Last name",
    },
];

class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            user: null,
        }
    }

    componentDidMount() {
        axios.get('/is-authenticated').then(res => {
            this.setState({
                isAuthenticated: res.data.isAuthenticated,
                user: res.data.user,
            });
        });
    }

    render() {
        return (
            <LayoutWithData>
                <div className="center">
                    <Overview title="Active Users" id="activeUsers" columns={columns} query={usersQuery} dataKey="users"
                              dataProperty="items"
                              whitelist={['email', 'first_name', 'last_name']}
                              image="running-applications.png">
                        {(this.state.isAuthenticated && this.state.user && this.state.user.roles && this.state.user.roles.filter(role => {if (role.permissions && role.permissions.invite) return role;}).length > 0) ? (<Link href="/invite-new-user"><a className="add-new">Invite new user </a></Link>) : ""}
                    </Overview>
                </div>
            </LayoutWithData>
        );
    }
}

export default Users;