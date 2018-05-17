import React, {Component} from 'react';

import DateTime from 'react-datetime/DateTime';
import OnSubmitForm from "../components/on_submit_form";
import OnChangeInput from "../components/on_change_input";

import axios from 'axios';

class ApplicationForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            application: props.application ? props.application : { uuid: null },
            user: null,
        };

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }
    componentDidMount() {
        axios.get('/is-authenticated').then(res => {
            this.setState({
                user: res.data.user,
            });
        });
    }
    handleOnChange(event, field) {
        let value = null;

        if (event.target && event.target.value !== undefined) {
            field = event.target.name;
            value = event.target.value;
        } else {
            if (typeof event !== 'object' || isNaN(Date.parse(event.toISOString()))) {
                return false;
            }

            value = event.toDate();
        }

        const application = Object.assign({}, this.state.application);
        application[field] = value;

        this.setState({application: application});
    }
    async handleOnSubmit(event) {
        event.preventDefault();
        event.returnValue = false;

        if (this.state.application && this.state.application.name && this.state.application.project_id && this.state.application.due_date) {
            const response = await this.props.mutate({
                variables: {
                    uuid: this.state.application.uuid,
                    name: this.state.application.name,
                    project_id: this.state.application.project_id,
                    due_date: this.state.application.due_date,
                    description: this.state.application.description,
                }
            });

            if (response && response.data) {
                if (response.data.update_application) {
                    this.setState({application: response.data.update_application});
                } else if (response.data.add_application) {
                    if (document && document.location && document.location.href) {
                        document.location.href = "/edit-application/" + response.data.add_application.uuid;
                    }
                }
            }
        }

        return false;
    }
    render() {
        return [
            <OnSubmitForm onSubmit={this.handleOnSubmit} className="form" id="addApplicationForm">
                <label htmlFor="name">project name</label>
                <OnChangeInput onChange={this.handleOnChange} type="text" id="name" name="name" value={this.state.application.name} placeholder="Project name" />
                <div className="inputWithLabel">
                    <label htmlFor="due_date">due date</label>
                    <DateTime onChange={(value) => {this.handleOnChange(value, "due_date")}} value={this.state.application.due_date} inputProps={{name: "due_date", id: "due_date", placeholder: "Due date", readOnly: true}} />
                </div>
                <div className="inputWithLabel">
                    <label htmlFor="project_id">project id</label>
                    <OnChangeInput onChange={this.handleOnChange} type="text" id="project_id" name="project_id" value={this.state.application.project_id} placeholder="Project ID" />
                </div>
                <div className="inputWithLabel">
                    <label htmlFor="owner">created by</label>
                    <input type="text" name="owner" id="owner" readOnly={true} value={this.state.user ? (this.state.user.first_name + " " + this.state.user.last_name) : "Nog logged in"} />
                </div>
                <label htmlFor="description">description</label>
                <textarea onChange={this.handleOnChange} rows="10" id="description" name="description" placeholder="Application description" value={this.state.application.description} />
                <input className="button" value="Save" type="submit" />
            </OnSubmitForm>,
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
                .button {
                    float: right;
                }
                #addApplicationForm {
                    overflow: hidden;
                }
                #addApplicationForm label {
                    display: block;
                    font-size: 0.8em;
                    color: #ffffff;
                    margin-bottom: 10px;
                }
                .form {
                    display: block;
                    width: auto;
                }
                .form input[type=text],
                .form textarea {
                    width: 100%;
                    display: block;
                    color: #ffffff;
                    background: transparent;
                    border: none;
                    border-bottom: 1px solid #ffffff;
                    outline: none;
                    margin-bottom: 20px;
                    font-size: 1.5em;
                }
                .form textarea {
                    resize: none;
                }
                .form input[name=name] {
                    font-size: 4em;
                }
                .form .inputWithLabel {
                    display: inline-block;
                    width: 33%;
                    margin-bottom: 10px;
                }
                .form .inputWithLabel label,
                .form .inputWithLabel input {
                    display: block;
                }
                .form input[name=due_date],
                .form input[name=project_id],
                .form input[name=owner] {
                    width: 70%;
                    border: 2px solid;
                    border-radius: 10px;
                    padding: 5px 8px;
                    margin-left: 0;
                    margin-bottom: 0;
                    text-align: center;
                    font-size: 0.8em;
                }
                .form input[name=owner],
                .rdt {
                    // display: inline-block;
                }
            `}</style>
        ];
    }
}

export default ApplicationForm;