import React, { Component } from 'react';
import RangeWrapper from "../components/range_wrapper";

import gql from 'graphql-tag';

const getTasksByTimeLineQuery = gql`
    query getTasksByTimeLineQuery($application_uuid: String!, $time_line_uuid: String!, $order: String, $direction: String) {
        tasks_by_application_and_time_line(application_uuid: $application_uuid, time_line_uuid: $time_line_uuid, order: $order, direction: $direction)
    }
`;

class TimeLineWrapper extends Component {
    constructor(props) {
        super();

        const startDate = props.startDate ? props.startDate : new Date();
        const numberOfDays = props.numberOfDays ? props.numberOfDays : 90;
        startDate.setDate(startDate.getDate() - parseInt(numberOfDays / 2));
        const timeLines = props.timeLines ? props.timeLines : [];

        this.state = {
            startDate: startDate,
            timeLines: timeLines.slice(0),
            dayWidth: props.dayWidth ? props.dayWidth : 6,
        };

        this.onScrollLeft = this.onScrollLeft.bind(this);
        this.onScrollRight = this.onScrollRight.bind(this);
    }
    onScrollLeft(event) {
        const newDate = new Date(this.state.startDate);
        newDate.setDate(newDate.getDate() - 30);
        newDate.setHours(0, 0, 0, 0);

        this.setState({
            startDate: newDate
        });
    }
    onScrollRight(event) {
        const newDate = new Date(this.state.startDate);
        newDate.setDate(newDate.getDate() + 30);
        newDate.setHours(0, 0, 0, 0);

        this.setState({
            startDate: newDate
        });
    }
    render() {
        let timeLineNumber = 1;

        return <div className={"timeLines" + (this.props.timeStamp ? (" " + this.props.timeStamp) : "")}>
            <span id="scrollLeft" onClick={this.onScrollLeft} />
            <span id="scrollRight" onClick={this.onScrollRight} />
            {this.state.timeLines.map(timeLine => {
                return <div key={timeLine.name} className={timeLineNumber === 1 ? "line first" : "line"}>
                    <div className="title">
                        <h2>{timeLine.name}</h2>
                    </div>
                    <RangeWrapper id={"range_" + timeLineNumber} query={getTasksByTimeLineQuery} variables={{application_uuid: this.props.application.uuid, time_line_uuid: timeLine.uuid}} dataKey="tasks_by_application_and_time_line" dataProperty="processes" dayWidth={this.state.dayWidth} first={timeLineNumber++ === 1} numberOfDays={this.props.numberOfDays} startDate={this.state.startDate} timeLine={timeLine} application={this.props.application} parent={this.props.parent} />
                </div>
            })}
            <style global jsx>{`
                .day .today {
                    display: none;
                    pointer-events: none;
                }
                .line .day .today {
                    display: block;
                    position: absolute;
                    left: -1px;
                    border-left: 1px solid #ffffff;
                    height: 100px;
                    bottom: -15px;
                }
                .line .day .today .point {
                    display: none;
                }
                .line.first .day .today {
                    height: 200px;
                }
                .line.first .day .today .point {
                    display: block;
                    position: absolute;
                    left: -10px;
                    top: 0;
                    width: 20px;
                    height: 20px;
                    border-radius: 10px;
                    background-color: #ffffff;
                }
            `}</style>
        </div>
    }
}

export default TimeLineWrapper;