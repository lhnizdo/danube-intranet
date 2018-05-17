import React, { Component } from 'react';
import {withApollo} from "react-apollo";
import DayRange from "./day_range";

class RangeWrapper extends Component {
    constructor(props) {
        super(props);

        this.mouse = {
            x: 0,
            y: 0
        };

        this.startIndex = -1;
        this.endIndex = -1;
        this.captureMouse = false;

        this.state = {
            dayWidth: props.dayWidth ? props.dayWidth : 6,
            eventDays: [],
            processes: [],
        };

        if (props.query) {
            this.fetchQuery(props.client, props.query, props.variables, props.dataKey, props.dataProperty);
        }

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
    }
    async fetchQuery(client, query, variables, dataKey, dataProperty) {
        const result = await client.query({query: query, variables: variables});
        let values = result.data[dataKey];

        if (!Array.isArray(values)) {
            switch (typeof values) {
                case "string":
                    values = JSON.parse(values);
                    break;

                default:
                    break;
            }
        }

        const state = {};
        state[dataProperty] = values;

        this.setState(state);
    }
    getDayIndex(start, current) {
        const startDate = new Date(start);
        const currentDate = new Date(current);

        return Math.ceil((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    }
    getIndex(obj) {
        // -264, -270
        const coordinates = obj.getBoundingClientRect();
        const rangeCoordinates = this.refs["range"].getBoundingClientRect();
        const left = Math.round((rangeCoordinates.right - rangeCoordinates.left - 900) / 2);

        return Math.floor((this.mouse.x - coordinates.left - left) / this.state.dayWidth);
    };
    onMouseDown(event) {
        this.endIndex = null;

        const startIndex = this.getIndex(event.currentTarget);
        let selectedProcess = null;

        this.state.processes.forEach(process => {
            if (!selectedProcess) {
                const processStartIndex = this.getDayIndex(this.props.startDate, process.start_date);
                const processEndIndex = processStartIndex + process.duration;

                if (startIndex >= processStartIndex && startIndex <= processEndIndex) {
                    selectedProcess = process;
                }
            }
        });

        if (selectedProcess) {
            if (this.props.parent.openModal) {
                this.props.parent.openModal(selectedProcess);
            }
        } else {
            this.startIndex = startIndex;
            this.captureMouse = true;
        }
    }
    onMouseUp(event) {
        this.captureMouse = false;

        if (this.endIndex === null || this.endIndex === this.startIndex) {
            // if (this.props.application.status_uuid === '546d5071-16d7-11e8-8927-995b4dfe3195') {
                if (!window.eventDays) {
                    window.eventDays = [];
                }

                window.eventDays.push({id: this.props.id, event: {id: this.props.id, index: this.startIndex - 1}});
            // }

            this.startIndex = null;
        } else {
            // if (this.props.application.status_uuid === '546d5070-16d7-11e8-8927-995b4dfe3195') {
                const startDate = new Date(this.props.startDate);
                startDate.setDate(startDate.getDate() + this.startIndex);
                startDate.setHours(0, 0, 0, 0);

                const endDate = new Date(this.props.startDate);
                endDate.setDate(endDate.getDate() + this.endIndex);
                endDate.setHours(0, 0, 0, 0);

                if (this.props.parent) {
                    if (this.props.parent.handleClearTask) {
                        this.props.parent.handleClearTask(() => {
                            if (this.props.parent.setStartDate) {
                                this.props.parent.setStartDate(startDate < endDate ? startDate : endDate, () => {
                                    if (this.props.parent.setDuration) {
                                        this.props.parent.setDuration(Math.abs(this.endIndex - this.startIndex), () => {
                                            this.startIndex = null;

                                            if (this.props.parent.setTimeLine) {
                                                this.props.parent.setTimeLine(this.props.timeLine.uuid, () => {
                                                    if (this.props.parent.openModal) {
                                                        this.props.parent.openModal();
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            // } else {
            //     this.startIndex = null;
            // }
        }
    }
    onMouseMove(event) {
        this.mouse.x = event.screenX;
        this.mouse.y = event.screenY;

        const endIndex = this.getIndex(event.currentTarget);

        if (this.captureMouse && parseInt(this.startIndex) > -1 && parseInt(endIndex) > -1 && parseInt(this.startIndex) < parseInt(898 / this.props.dayWidth) && parseInt(endIndex) < parseInt(898 / this.props.dayWidth)) {
            // if (this.props.application.status_uuid === '546d5070-16d7-11e8-8927-995b4dfe3195') {
                window.processes = [];
                window.processes.push({id: this.props.id,
                    process: {
                        id: this.props.id,
                        start: Math.min(this.startIndex, endIndex),
                        size: Math.abs(endIndex - this.startIndex)
                    }
                });
            // }

            this.endIndex = endIndex;
        } else {
            window.processes = [];
        }

        window.currentDay = endIndex;
    }
    render() {
        return (
            <div className="range" onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseMove={this.onMouseMove} ref="range">
                <span className="beforeRange"/>
                <span className="startLine"/>
                <DayRange dayWidth={this.state.dayWidth} id={this.props.id} first={this.props.first} numberOfDays={this.props.numberOfDays} startDate={this.props.startDate} scroll={this.props.scroll} processes={this.state.processes} eventDays={this.state.eventDays} parent={this} />
                <span className="afterRange"/>
                <span className="endLine"/>
            </div>
        );
    }
}

export default withApollo(RangeWrapper);

