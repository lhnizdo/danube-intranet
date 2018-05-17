import React, {Component} from 'react';

import gql from 'graphql-tag';
import {graphql, withApollo} from "react-apollo";

import LayoutWithData from "../components/layout_with_data";
import ComplexButton from '../components/complex_button';
import DayRange from "../components/day_range";
import Modal from 'react-modal';
import TimeLineWrapper from "../components/time_line_wrapper";
import ApplicationForm from "../components/application_form";
import TaskForm from "../components/task_form";
import Overview from "../components/overview";
import Clear from "../components/clear";
import StyledRangeInput from "../components/styled_range_input";

const updateApplicationMutation = gql`
    mutation updateApplicationMutation($uuid: String!, $name: String, $project_id: String, $due_date: String, $description: String, $status_uuid: String) {
        update_application(uuid: $uuid, name: $name, project_id: $project_id, due_date: $due_date, description: $description, status_uuid: $status_uuid) {
            uuid
            name
            project_id
            due_date
            description
            status_uuid
        }
    }
`;

const getTimeLinesQuery = gql`
    query getTimeLinesQuery {
        time_lines {
            uuid
            name
        }
    }
`;

const addTaskMutation = gql`
    mutation addTaskMutation($name: String!, $description: String!, $start_date: String!, $duration: String!, $assigned_uuid: String!, $application_uuid: String!, $time_line_uuid: String!, $status_uuid: String) {
        add_task(name: $name, description: $description, start_date: $start_date, duration: $duration, assigned_uuid: $assigned_uuid, application_uuid: $application_uuid, time_line_uuid: $time_line_uuid, status_uuid: $status_uuid) {
            uuid
            name
            description
            start_date
            duration
        }
    }
`;

const updateTaskMutation = gql`
    mutation updateTaskMutation($uuid: String!, $name: String, $description: String, $start_date: String, $duration: String, $assigned_uuid: String, $application_uuid: String, $time_line_uuid: String, $status_uuid: String) {
        update_task(uuid: $uuid, name: $name, description: $description, start_date: $start_date, duration: $duration, assigned_uuid: $assigned_uuid, application_uuid: $application_uuid, time_line_uuid: $time_line_uuid, status_uuid: $status_uuid) {
            uuid
            name
            description
            start_date
            duration
        }
    }
`;

const deleteTaskMutation = gql`
    mutation deleteTaskMutation($uuid: String, $name: String, $description: String, $start_date: String, $duration: String, $assigned_uuid: String, $application_uuid: String, $time_line_uuid: String, $status_uuid: String) {
        delete_task(uuid: $uuid, name: $name, description: $description, start_date: $start_date, duration: $duration, assigned_uuid: $assigned_uuid, application_uuid: $application_uuid, time_line_uuid: $time_line_uuid, status_uuid: $status_uuid) {
            uuid
            name
            description
            start_date
            duration
        }
    }
`;

const getApplicationQuery = gql`
    query getApplicationQuery($uuid: String!) {
        application_by_uuid(uuid: $uuid) {
            uuid
            name
            project_id
            due_date
            description
            status_uuid
        }
    }
`;

const getTasksQuery = gql`
    query getTasksQuery($application_uuid: String!, $order: String, $direction: String) {
        tasks_by_application(application_uuid: $application_uuid, order: $order, direction: $direction)
    }
`;

const getTasksByTimeLineQuery = gql`
    query getTasksByTimeLineQuery($application_uuid: String!, $time_line_uuid: String!, $order: String, $direction: String) {
        tasks_by_application_and_time_line(application_uuid: $application_uuid, time_line_uuid: $time_line_uuid, order: $order, direction: $direction)
    }
`;

const EditApplicationFormWithMutation = graphql(updateApplicationMutation)(ApplicationForm);
const AddTaskFormWithMutation = graphql(addTaskMutation, {name: 'saveMutation'})(TaskForm);
const UpdateTaskFormWithMutation = graphql(deleteTaskMutation, {name: 'deleteMutation'})(graphql(updateTaskMutation, {name: 'saveMutation'})(TaskForm));

export const columns = [
    {
        className: "due-date",
        title: "Start Date"
    },
    {
        className: "name",
        title: "Task Name"
    },
    {
        className: "person",
        title: "Person"
    },
    {
        className: "status",
        title: "Status"
    },
    {
        className: "duration",
        title: "Duration"
    }
];

class CancelApplicationButton extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(event) {
        this.props.client.mutate({
            mutation: updateApplicationMutation,
            variables: {
                uuid: this.props.application.uuid,
                status_uuid: 'ddd50bd4-3c4f-11e8-81d1-efa81d454728',
            }
        }).then(() => {
            setTimeout(() => {
                if (document && document.location && document.location.href) {
                    document.location.href = "/applications";
                }
            }, 1000)
        });
    }
    render() {
        return <button onClick={this.handleClick}>Cancel application</button>;
    }
}

const CancelApplicationButtonWithApollo = withApollo(CancelApplicationButton);

class StartApplicationButton extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(event) {
        this.props.client.mutate({
            mutation: updateApplicationMutation,
            variables: {
                uuid: this.props.application.uuid,
                status_uuid: 'ddd50bd1-3c4f-11e8-81d1-efa81d454728',
            }
        }).then(() => {
            setTimeout(() => {
                if (document && document.location && document.location.href) {
                    document.location.href = "/edit-application/" + this.props.application.uuid;
                }
            }, 1000)
        });
    }
    render() {
        return <ComplexButton onClick={this.handleClick}>
            <p>Start Application</p>
        </ComplexButton>;
    }
}

const StartApplicationButtonWithApollo = withApollo(StartApplicationButton);

class EditApplicationComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            application: {
                uuid: props.url.query.uuid
            },
            shouldOpenAddForm: false,
            shouldOpenEditForm: false,
            task: {},
            timeLine: null,
            dayWidth: 7,
            timeStamp: Date.now(),
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.handleSaveTask = this.handleSaveTask.bind(this);
        this.handleDeleteTask = this.handleDeleteTask.bind(this);
        this.handleInviteUsers = this.handleInviteUsers.bind(this);

        this.onZoom = this.onZoom.bind(this);
    }
    async handleSaveTask(event) {
        event.preventDefault();
        event.returnValue = false;

        if (event.mutate) {
            const task = Object.assign({}, this.state.task);
            task.application_uuid = this.state.application.uuid;

            if (!task.time_line_uuid) {
                switch (task.name) {
                    case 'Design':
                        task.time_line_uuid = 'ddd69270-3c4f-11e8-81d1-efa81d454728';
                        break;

                    case 'Testing':
                        task.time_line_uuid = 'ddd69270-3c4f-11e8-81d1-efa81d454728';
                        break;

                    case 'Material Order':
                        task.time_line_uuid = 'ddd69271-3c4f-11e8-81d1-efa81d454728';
                        break;

                    case 'Tooling / manufacturing':
                        task.time_line_uuid = 'ddd69272-3c4f-11e8-81d1-efa81d454728';
                        break;

                    default:
                        return false;
                }
            }

            event.mutate({
                variables: task,
                refetchQueries: [
                    {
                        query: getTasksQuery,
                        variables: {
                            application_uuid: this.state.application.uuid
                        }
                    },
                    {
                        query: getTasksByTimeLineQuery,
                        variables: {
                            application_uuid: this.state.application.uuid,
                            time_line_uuid: task.time_line_uuid,
                        }
                    }
                ],
            }).then(() => {
                setTimeout(() => this.setState({timeStamp: Date.now()}), 1000);
            });
        }

        this.closeModal();
        return false;
    }
    async handleDeleteTask(event) {
        event.preventDefault();
        event.returnValue = false;

        if (event.mutate) {
            event.mutate({
                variables: {
                    uuid: this.state.task.uuid,
                },
                refetchQueries: [
                    {
                        query: getTasksQuery,
                        variables: {
                            application_uuid: this.state.application.uuid
                        }
                    },
                    {
                        query: getTasksByTimeLineQuery,
                        variables: {
                            application_uuid: this.state.application.uuid,
                            time_line_uuid: this.state.task.time_line_uuid,
                        }
                    }
                ],
            }).then(() => {
                setTimeout(() => this.setState({timeStamp: Date.now()}), 1000);
            });
        }

        this.closeModal();
        return false;
    }
    handleClearTask(callback) {
        this.setState({task: {}}, callback);
    }
    handleUpdateTask(event, callback) {
        const task = Object.assign({}, this.state.task);

        const field = event.target.name;
        let value = event.target.value;

        if (event.target.type === 'checkbox') {
            value = event.target.checked ? 1 : 0;
        }

        task[field] = value;
        this.setState({task: task}, callback);
    }
    handleInviteUsers(event) {
        let body = {
            data: "test"
        };

        fetch('/mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'html/text',
            },
            body: JSON.stringify(body),
        });
    }
    onZoom(event) {
        this.setState({
            dayWidth: event.target.value,
        });
    }
    setStartDate(startDate, callback) {
        this.handleUpdateTask({target: {
            name: 'start_date',
            value: startDate
        }}, callback);
    }
    setDuration(duration, callback) {
        this.handleUpdateTask({target: {
            name: 'duration',
            value: duration
        }}, callback);
    }
    setTimeLine(timeLine, callback) {
        this.setState({
            timeLine: timeLine
        }, () => {
            this.handleUpdateTask({target: {
                name: 'time_line_uuid',
                value: timeLine
            }}, callback);
        });
    }
    openModal(selected) {
        let task = null;

        if (selected) {
            // fix task
            task = Object.assign({}, selected);
            task.start_date = new Date(task.start_date);
            task.start_date.setHours(0, 0, 0, 0);
            delete task["assigned"];
            delete task["status"];
        }

        this.setState(task ? {task: task, shouldOpenEditForm: true} : {shouldOpenAddForm: true});
        window.processes = [];
    }
    closeModal() {
        this.setState({shouldOpenEditForm: false, shouldOpenAddForm: false});
    }
    render() {
        const numberOfDays = Math.ceil(898 / this.state.dayWidth);

        return (
            <LayoutWithData>
                <div className="center">
                    <div className="left">
                        <ComplexButton onClick={(event) => {this.setTimeLine(null, () => {this.handleClearTask(() => {this.openModal();});});}} disabled={(!this.state.application || !this.state.application.uuid)}>
                            <p>Add Process</p>
                            <DayRange remaining="126" numberOfDays="21" />
                        </ComplexButton>
                        <StartApplicationButtonWithApollo application={this.state.application} />
                    </div>
                    <EditApplicationFormWithMutation query={getApplicationQuery} variables={{uuid: this.state.application.uuid}} dataKey="application_by_uuid" dataProperty="application" parent={this} />
                    <Clear />
                    <div className="delimiter" />
                    <TimeLineWrapper timeStamp={this.state.timeStamp} dayWidth={this.state.dayWidth} query={getTimeLinesQuery} dataKey="time_lines" dataProperty="timeLines" application={this.state.application} numberOfDays={numberOfDays} parent={this} />
                    <Clear />
                    <StyledRangeInput id="timeLineZoom" label="Zoom" min="5" max="9" dayWidth={this.state.dayWidth} onChange={this.onZoom} />
                    <div className="delimiter" />
                    <Overview title="Current tasks" id="currentTasks" columns={columns} timeStamp={this.state.timeStamp}
                              query={getTasksQuery} variables={{application_uuid: this.state.application.uuid}} dataKey="tasks_by_application" dataProperty="items"
                              whitelist={['start_date', 'name', 'assigned/full_name', 'status/description', 'duration']}
                              image="running-applications.png" hideShowAllButton={true} requiresItems={true}>
                        <CancelApplicationButtonWithApollo application={this.state.application} />
                        <button onClick={this.handleInviteUsers}>Invite users</button>
                    </Overview>
                </div>
                <Modal isOpen={this.state.shouldOpenAddForm} contentLabel="Add Process" style={{
                    overlay: {
                        zIndex: "1004"
                    },
                    content: {
                        top: "calc(50% - 220px)",
                        left: "calc(50% - 271px)",
                        maxWidth: "350px",
                        minHeight: "400px",
                        maxHeight: "440px",
                        backgroundColor: "#3c3c3b",
                        paddingBottom: "0",
                        padding: "20px 30px",
                        borderRadius: "10px",
                        color: "#ffffff",
                        fontFamily: "Arial,Verdana,sans-serif",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        overflow: "visible",
                        zIndex: "1005"
                    }
                }}>
                    <div className="title">NEW PROCESS</div>
                    <AddTaskFormWithMutation onOkClick={this.handleSaveTask} onCancelClick={this.closeModal} onChange={this.handleUpdateTask} values={this.state.task} timeLine={this.state.timeLine} parent={this} />
                </Modal>
                <Modal isOpen={this.state.shouldOpenEditForm} contentLabel="Edit Process" style={{
                    overlay: {
                        zIndex: "1004"
                    },
                    content: {
                        top: "calc(50% - 220px)",
                        left: "calc(50% - 271px)",
                        maxWidth: "350px",
                        minHeight: "400px",
                        maxHeight: "440px",
                        backgroundColor: "#3c3c3b",
                        paddingBottom: "0",
                        padding: "20px 30px",
                        borderRadius: "10px",
                        color: "#ffffff",
                        fontFamily: "Arial,Verdana,sans-serif",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        overflow: "visible",
                        zIndex: "1005"
                    }
                }}>
                    <div className="title">EDIT PROCESS</div>
                    <UpdateTaskFormWithMutation edit={true} onOkClick={this.handleSaveTask} onCancelClick={this.closeModal} onDeleteClick={this.handleDeleteTask} onChange={this.handleUpdateTask} values={this.state.task} timeLine={this.state.task.time_line_uuid} parent={this} />
                </Modal>
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
                        height: 25px;
                        margin-bottom: 25px;
                        border-bottom: 1px solid #ffffff;
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

                    .styledRangeInput {
                        width: 100%;
                        margin: 50px 0;
                    }
                    .styledRangeInput label {
                        display: inline-block;
                        width: 300px;
                        color: #ffffff;
                    }
                    .styledRangeInput input {
                        width: calc(100% - 300px);
                        max-width: 1000px;
                    }

                    .timeLines {
                        width: 100%;
                        position: relative;
                    }
                    .timeLines #today {
                        position: absolute;
                        display: block;
                        left: calc(50% + 149px);
                        height: 100%;
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
                    .timeLines #scrollLeft {
                        position: absolute;
                        top: 0px;
                        left: calc(120px + (50% - 450px));
                        background: url(/static/end.png) no-repeat;
                        width: 31px;
                        height: 35px;
                        cursor: pointer;
                        z-index: 1000;
                    }
                    .timeLines #scrollRight {
                        position: absolute;
                        top: 0px;
                        right: calc((50% - 450px) - 180px);
                        background: url(/static/start.png) no-repeat;
                        width: 31px;
                        height: 35px;
                        cursor: pointer;
                        z-index: 1000;
                    }
                    .timeLines .line {
                        height: 100px;
                    }
                    .timeLines .line.first {
                        height: 200px;
                    }
                    .timeLines .line .title {
                        float: left;
                        margin-top: 34px;
                        height: 66px;
                        width: 300px;
                        text-transform: uppercase;
                        color: #ffffff;
                    }
                    .timeLines .line.first .title {
                        margin-top: 134px;
                    }
                    .timeLines .line .range {
                        height: 100px;
                        position: relative;
                        overflow: hidden;
                    }
                    .timeLines .line.first .range {
                        height: 200px;
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
                    .timeLines .line.first .range .beforeRange,
                    .timeLines .line.first .range .afterRange {
                        top: 100px;
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
                        width: 898px;
                        left: calc(50% - 450px);
                        overflow: hidden;
                    }
                    .timeLines .line .range .dayRange .days {
                        padding: 45px 0 11px 0;
                    }
                    .timeLines .line.first .range .dayRange .processes {
                        margin-top: 100px;
                    }
                    .timeLines .line.first .range .dayRange .events {
                        margin-top: 100px;
                    }
                    .timeLines .line.first .range .dayRange .legend {
                        top: 50px;
                    }
                    .timeLines .line.first .range .dayRange .legend .year .month {
                        margin-top: 18px;
                    }
                    .timeLines .line .range .dayRange .day:hover .date {
                        display: inline-block;
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

                    #currentTasks .after-list button {
                        cursor: pointer;
                        background-color: #3c3c3b;
                        color: white;
                        line-height: 1.4;
                        padding: 0.5% 1%;
                        margin: 1%;
                        min-width: 150px;
                        text-align: center;
                        text-transform: uppercase;
                        float: right;
                        border: none;
                        border: solid 2px #9D9D9D;
                        border-radius: 10px;
                    }
                    #currentTasks .after-list button:hover {
                        background-color: #565656;
                    }

                    /* Modal */
                    .ReactModal__Content .title {
                        text-align: right;
                        width: 100%;
                        border-bottom: 1px solid white;
                    }
                `}</style>
            </LayoutWithData>
        );
    }
}

export default EditApplicationComponent;