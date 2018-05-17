import React, { Component } from 'react';
import Clear from "./clear";
import DynamicSelect from "./dynamic_select";
import DateTime from 'react-datetime/DateTime';

import gql from 'graphql-tag';
import { graphql } from "react-apollo";

const getUsersQuery = gql`
    query getUsersQuery {
        users_for_select
    }
`;

const getPredefinedTasks = gql`
    query getPredefinedTasks {
        predefined_tasks {
            value: name,
            label: name,
            filter: time_line_uuid
        }
    }
`;

const UsersDynamicSelect = graphql(getUsersQuery)(DynamicSelect);
const PredefinedTasksDynamicSelect = graphql(getPredefinedTasks)(DynamicSelect);

class TaskForm extends Component {
    constructor(props) {
        super(props);

        const parent = props.parent ? props.parent : this;

        this.onOkClick = props.onOkClick.bind(parent);
        this.onCancelClick = props.onCancelClick.bind(parent);

        if (props.edit) {
            this.onDeleteClick = props.onDeleteClick.bind(parent);
        }

        this.startDate = null;
        this.endDate = null;

        this.onChange = props.onChange.bind(parent);

        this.values = this.props.values ? this.props.values : {};
    }
    calculate_date(startDate, duration) {
        if (startDate && duration) {
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + duration);

            return endDate;
        }

        return null;
    }
    render() {
        return [
            <form id="taskForm" className="addNewEvent" action="" method="post">
                <div className="text">
                    <label htmlFor="assigned-to">ASSIGNED TO</label>
                    <UsersDynamicSelect name="assigned-to" id="assigned-to" ref="assigned-to" value={this.values.assigned_uuid} onChange={(event) => {this.onChange({target: {name: "assigned_uuid", value: event.target.value}})}} dataKey="users_for_select" />
                </div>
                <div className="text">
                    <label htmlFor="task">SELECT A TASK</label>
                    <PredefinedTasksDynamicSelect name="task" id="task" ref="task" onChange={(event) => {this.onChange({target: {name: "name", value: event.target.value}})}} value={this.values.name} filter={this.props.timeLine} dataKey="predefined_tasks" />
                </div>
                <div className="date">
                    <label htmlFor="date-to">TO</label>
                    <DateTime onChange={(value) => {
                        if (this.startDate) {
                            let endDate = new Date(value);
                            endDate.setHours(0, 0, 0, 0);

                            const duration = Math.floor((endDate - this.startDate) / (1000 * 3600 * 24));

                            if (duration > 0) {
                                this.endDate = endDate;
                                this.onChange({target: {name: 'duration', value: duration}});
                            }
                        }
                    }} dateFormat="DD.MM.YYYY" timeFormat={false} defaultValue={this.values.duration ? this.calculate_date(this.values.start_date, parseInt(this.values.duration)) : undefined} inputProps={{name: "date-to", id: "date-to", ref: "date-to", readOnly: true}} />
                </div>
                <div className="date">
                    <label htmlFor="date-from">FROM</label>
                    <DateTime onChange={(value) => {
                        let startDate = new Date(value);
                        startDate.setHours(0, 0, 0, 0);

                        if (this.endDate) {
                            const duration = Math.floor((this.endDate - startDate) / (1000 * 3600 * 24));

                            if (duration > 0) {
                                this.onChange({target: {name: 'duration', value: duration}}, () => {
                                    this.startDate = startDate;
                                    this.onChange({target: {name: 'start_date', value: startDate}});
                                });
                            }
                        } else {
                            this.startDate = startDate;
                            this.onChange({target: {name: 'start_date', value: startDate}});
                        }
                    }} dateFormat="DD.MM.YYYY" timeFormat={false} defaultValue={this.values.start_date} inputProps={{name: "date-from", id: "date-from", ref: "date-from", readOnly: true}} />
                </div>
                <div className="description">
                    <label htmlFor="description">DESCRIPTION</label>
                    <textarea form="taskForm" name="description" id="description" ref="description" onChange={this.onChange}>{this.values.description}</textarea>
                </div>

                <input className="close button" value="Close" type="submit" onClick={this.onCancelClick} />
                {this.onDeleteClick ? <input className="delete button" value="Delete" type="submit" onClick={(event) => {
                    event.mutate = this.props.deleteMutation;
                    this.onDeleteClick(event);
                }} /> : null}
                <input className="button" value={this.props.edit ? "Update" : "Add"} type="submit" onClick={(event) => {
                    event.mutate = this.props.saveMutation;
                    this.onOkClick(event);
                }} />

                <input id="approved" name="approved" type="checkbox" ref="approved" checked={this.values.status_uuid == "ddd72eb1-3c4f-11e8-81d1-efa81d454728"} onChange={(event) => {
                    if (event && event.target) {
                        let value = event.target.checked ? "ddd72eb1-3c4f-11e8-81d1-efa81d454728" : "ddd72eb0-3c4f-11e8-81d1-efa81d454728";

                        this.values.status_uuid = value;
                        this.onChange({target: {name: 'status_uuid', value: value}});
                    }
                }} />
                <label htmlFor="approved">Aproved by asigned user</label>
                <Clear />
            </form>,
            <style global jsx>{`
                .button {
                    text-decoration:none;
                    line-height: 1.4;
                    background-color: #3c3c3b;
                    color: white;
                    margin: 1%;
                    padding: 5px 8px;
                    border: solid 2px #9D9D9D;
                    border-radius: 10px;
                    cursor:pointer;
                    font-size:14px;
                }
                .button:hover {
                    background-color: #565656;
                }
                .button.close {
                    float: right;
                }
                form.addNewEvent > div {
                    float: right;
                    padding: 10px;
                    padding-right: 0;
                }
                form.addNewEvent label {
                    display: block;
                    font-size: 0.8em;
                }
                form.addNewEvent .text {
                    width: 47%;
                }
                form.addNewEvent .date {
                    width: 30%;
                }
                form.addNewEvent .description {
                    width: 100%;
                }
                form.addNewEvent input {
                    display: inline-block;
                    width: 100%;
                }
                form.addNewEvent select {
                    width: 100%;
                }
                form.addNewEvent textarea {
                    width: 100%;
                    min-height: 200px;
                    resize: none;
                    text-align: left;
                }
                form.addNewEvent input[type=submit] {
                    width: auto;
                    float: right;
                }
                form.addNewEvent input#approved {
                    margin-top: 10px;
                    width: auto;
                    float: left;
                }
                form.addNewEvent label[for=approved] {
                    margin-top: 8px;
                    font-size: 0.8em;
                    float: left;
                }
            `}</style>
        ];
    }
}

export default TaskForm;