import React, { Component } from 'react';

import gql from 'graphql-tag';
import { graphql } from "react-apollo";

import LayoutWithData from "../components/layout_with_data";
import ComplexButton from '../components/complex_button';
import DayRange from "../components/day_range";
import ApplicationForm from "../components/application_form";
import Clear from "../components/clear";

const addApplicationMutation = gql`
    mutation addApplicationMutation($name: String!, $project_id: String!, $due_date: String!) {
        add_application(name: $name, project_id: $project_id, due_date: $due_date) {
            uuid
            name
        }
    }
`;

const AddApplicationFormWithMutation = graphql(addApplicationMutation)(ApplicationForm);

class AddApplicationComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            application: {
                uuid: ""
            },
            modalIsOpen: false
        };
    }
    render() {
        return (
            <LayoutWithData>
                <div className="center">
                    <div className="left">
                        <ComplexButton onClick={this.openModal} disabled={true}>
                            <p>Add Process</p>
                            <DayRange remaining="126" numberOfDays="21" />
                        </ComplexButton>
                        <ComplexButton disabled={true}>
                            <p>Start Application</p>
                        </ComplexButton>
                    </div>
                    <AddApplicationFormWithMutation application={this.state.application} />
                    <Clear />
                </div>
                <style global jsx>{`
                    .clear {
                        clear: both;
                    }
                    .left {
                        width: 250px;
                        height: auto
                        float: left;
                        text-align: left;
                    }
                    .left .button {
                        margin-bottom: 10px;
                        float: left;
                    }
                    .delimiter {
                        height: 50px;
                    }
                    .center {
                        height: 100%
                        max-width: 1300px;
                        margin: 0 !important;
                    }
                    .form {
                        width: calc(100% - 250px) !important;
                        float: right;
                    }
                    .timeLines {
                        width: 100%;
                        position: relative;
                    }
                    .timeLines #today {
                        position: absolute;
                        display: block;
                        left: 799px;
                        height: 400px;
                        border-right: 1px solid #ff0000;
                        z-index: 1000;
                    }
                    .timeLines #todayCircle {
                        position: absolute;
                        display: block;
                        left: 790px;
                        height: 20px;
                        width: 20px;
                        border-radius: 10px;
                        background-color: #ff0000;
                        z-index: 1000;
                    }
                    .timeLines .line {
                        height: 100px;
                    }
                    .timeLines .line .title {
                        float: left;
                        margin-top: 34px;
                        height: 66px;
                        width: 300px;
                        text-transform: uppercase;
                        color: #ffffff;
                    }
                    .timeLines .line .range {
                        height: 100px;
                        position: relative;
                        overflow: hidden;
                    }
                    .timeLines .line .range .beforeRange,
                    .timeLines .line .range .afterRange {
                        position: absolute;
                        top: 0;
                        left: 0;
                        display: block;
                        height: 65px;
                        width: calc(50% - 450px);
                        border-bottom: 1px solid #9D9D9D;
                    }
                    .timeLines .line .range .afterRange {
                        left: initial;
                        right: 0;
                    }
                    .timeLines .line .range .startLine,
                    .timeLines .line .range .endLine {
                        position: absolute;
                        top: 0;
                        left: 0;
                        display: block;
                        height: 100%;
                        width: calc(50% - 450px);
                        border-right: 1px solid #ffffff;
                    }
                    .timeLines .line .range .endLine {
                        border-right: none;
                        border-left: 1px solid #ffffff;
                        left: initial;
                        right: 0;
                    }
                    .timeLines .line .range .startSymbol,
                    .timeLines .line .range .endSymbol {
                        position: absolute;
                        top: 0;
                        left: calc(50% - 450px);
                        display: block;
                        height: 35px;
                        width: 31px;
                        background-image: url(/static/start.png);
                    }
                    .timeLines .line .range .endSymbol {
                        left: initial;
                        right: calc(50% - 450px);
                        background-image: url(/static/end.png);
                    }
                    .timeLines .line .range .dayRange {
                        padding: 45px 0 11px 0;
                    }

                    .button .dayRange {
                        margin: 0 auto;
                        width: 100% !important;
                    }
                    .button .dayRange .legend {
                        display: none;
                    }
                    .button .day .date {
                        display: none !important;
                    }
                `}</style>
            </LayoutWithData>
        );
    }
}

export default AddApplicationComponent;