import React, { Component } from 'react';
import Day from './day';
import EventDay from './event_day';
import Process from './process';
import Clear from "./clear";

const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const numberToText = require('number-to-text');
require('number-to-text/converters/en-us');

const dateFormat = require('dateformat');

class DayRange extends Component {
    constructor(props) {
        super();

        let numberOfDays = props.numberOfDays ? props.numberOfDays : 7;
        let days = Array.apply(null, {length: props.numberOfDays}).map(Number.call, Number);

        this.state = {
            numberOfDays: numberOfDays,
            temporaryEventDays: [],
            temporaryProcesses: [],
            days: days,
            dayWidth: props.dayWidth ? props.dayWidth : 6,
            currentDay: -1
        };
    }
    getYear(date) {
        return {
            name: date.getFullYear(),
            months: []
        };
    }
    getMonth(date) {
        return {
            name: monthNames[date.getMonth()],
            weeks: []
        };
    }
    getWeekNumber(year, date) {
        let startOfTheYear = new Date(year, 0, 1);
        let weekDay = date.getDay() > 0 ? date.getDay() : 7;
        let dayNumber = Math.floor((date - startOfTheYear) / 1000 / 3600 / 24) + 1;

        return Math.floor((dayNumber - weekDay + 10) / 7);
    }
    getWeek(date) {
        let weekNumber = this.getWeekNumber(date.getFullYear(), date);

        if (weekNumber < 1) {
            weekNumber = this.getWeekNumber(date.getFullYear() - 1, date);
        }

        return {
            name: weekNumber,
            days: []
        };
    }
    getDayIndex(start, current) {
        const startDate = new Date(start);
        const currentDate = new Date(current);

        return Math.ceil((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    }
    prepareYears(days, startDate) {
        let currentWeek = null, currentMonth = null, currentYear = null;
        let years = [];

        let date = startDate ? new Date(startDate) : new Date();

        days.forEach((day, index, array) => {
            if (!currentYear || !currentMonth || !currentWeek) {
                currentYear = this.getYear(date);
                currentMonth = this.getMonth(date);
                currentWeek = this.getWeek(date);
            } else if (date.getMonth() === 0 && date.getDate() === 1) {
                if (date.getDay() !== 1) {
                    currentWeek.skip = true;
                }

                currentMonth.weeks.push(currentWeek);
                currentYear.months.push(currentMonth);
                years.push(currentYear);

                currentWeek = this.getWeek(date);
                currentMonth = this.getMonth(date);
                currentYear = this.getYear(date);
                currentMonth.fromStart = true;
            } else if (date.getDate() === 1) {
                if (date.getDay() !== 1) {
                    currentWeek.skip = true;
                }

                currentMonth.weeks.push(currentWeek);
                currentYear.months.push(currentMonth);

                currentWeek = this.getWeek(date);
                currentMonth = this.getMonth(date);
                currentMonth.fromStart = true;
            } else if (date.getDay() === 1) {
                currentMonth.weeks.push(currentWeek);

                currentWeek = this.getWeek(date);
            }

            currentWeek.days.push(new Date(date));

            if (index !== array.length - 1) {
                date.setDate(date.getDate() + 1);
            }
        });

        if (date.getDay() !== 0) {
            currentWeek.skip = true;
        }

        currentMonth.weeks.push(currentWeek);
        currentYear.months.push(currentMonth);
        years.push(currentYear);

        return years;
    }
    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 100);
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    tick() {
        const state = {currentDay: window.currentDay};

        if (window.eventDays) {
            const eventDays = window.eventDays.filter(eventDay => (eventDay.id === this.props.id)).map(eventDay => eventDay.event);
            state.temporaryEventDays = eventDays;

        }

        if (window.processes) {
            const processes = window.processes.filter(process => (process.id === this.props.id)).map(process => process.process);
            state.temporaryProcesses = processes;
        }

        this.setState(state);
    }
    render() {
        let years = this.prepareYears(this.state.days, this.props.startDate);
        let remaining = parseInt(this.props.remaining) > 0 ? parseInt(this.props.remaining) : 898;
        let monthNum = 0;
        let yearNum = 0;

        return <div className="dayRange" id={this.props.id}>
            <div className="legend" style={{left: this.props.scroll ? (this.props.scroll - 1): -1}}>
                {years.map(year => <div key={"year_" + year.name} className={"year" + (years.length > 1 && yearNum++ === 0 ? " previous" : "")}>
                    {this.props.first ? <span className="name">{year.name}</span> : null}
                    {year.months.map(month => <div key={"month" + year.name + "_" + month.name} className={"month " + (monthNum++ % 2 === 0 ? "even" : "odd")}>
                        {this.props.first ? <span className={"name" + (month.fromStart ? "" : " empty")}>{month.fromStart ? month.name : '\u00A0'}</span> : null}
                        {month.weeks.map(week => <div key={"week" + year.name + "_" + month.name + "_" + week.name} className={"week " + numberToText.convertToText(week.days.length, {separator: "-", case: "lowerCase"}) + "-days" + (week.skip > 0 ? " skip" : "") }>
                            {this.props.first ? <span className="name">{week.name}</span> : null}
                            {this.props.first ? week.days.map((day, index) => (<div className="day" id={"day_" + this.getDayIndex(this.props.startDate, day)} style={{left: (index * this.props.dayWidth) + "px", display: (this.getDayIndex(this.props.startDate, day) === this.state.currentDay) ? "inline-block" : "none"}}>{dateFormat(day, "dd.mm.yyyy")}
                                <span>&nbsp;</span>
                            </div>)) : null}
                        </div>)}
                    </div>)}
                </div>)}
                <Clear />
            </div>
            <div className="processes">
                {this.props.processes ? this.props.processes.map(process => (
                    <Process dayWidth={this.state.dayWidth} key={process.id + Math.random()} start={this.getDayIndex(this.props.startDate, process.start_date)} size={process.duration} status={process.status.name} process={process} />
                )) : null}
                {this.state.temporaryProcesses.map(process => (
                    <Process dayWidth={this.state.dayWidth} key={process.id + Math.random()} start={process.start} size={process.size} status="not_approved" />
                ))}
            </div>
            <div className="events">
                {this.props.eventDays ? this.props.eventDays.map(eventDay => (
                    <EventDay dayWidth={this.state.dayWidth} key={eventDay.id + Math.random()} index={this.getDayIndex(this.props.startDate, eventDay.date)} />
                )) : null}
                {this.state.temporaryEventDays.map(eventDay => (
                    <EventDay temporary={true} dayWidth={this.state.dayWidth} key={eventDay.id + Math.random()} index={eventDay.index} />
                ))}
            </div>
            <div className="days" style={{ left: this.props.scroll ? this.props.scroll : 0}}>
                {this.state.days.map(day => {
                    let newDate = this.props.startDate ? new Date(this.props.startDate) : new Date();
                    newDate.setDate(newDate.getDate() + day);

                    if (day === this.state.numberOfDays - 1) {
                        return <Day dayWidth={this.state.dayWidth} key={day} day={day} date={newDate} last={true} remaining={remaining} />;
                    } else {
                        remaining -= this.state.dayWidth;
                        return <Day dayWidth={this.state.dayWidth} key={day} day={day} date={newDate} last={false} />;
                    }
                })}
            </div>
            <style jsx>{`
                .dayRange {
                    position: relative;
                    width: fit-content;
                }
                .dayRange .legend {
                    height: 100px;
                    width: max-content;
                    position: absolute;
                    top: 0;
                }
                .dayRange .legend .name {
                    color: #5d5d5d;
                    padding-left: 5px;
                    display: block;
                }
                .dayRange .legend .name.empty {
                    width: ${this.state.dayWidth}px;
                    padding: 0;
                }
                .dayRange .legend .year {
                    position: relative;
                    float: left;
                }
                .dayRange .legend .year > .name {
                    position: absolute;
                }
                .dayRange .legend .year.previous .name {
                    right: 5px;
                }
                .dayRange .legend .year .month {
                    background: #8a8a8a33;
                    display: inline-block;
                }
                .dayRange .legend .year .month.even {
                    background: #6d6d6d33;
                }
                .dayRange .legend .year .month .week {
                    height: 113px;
                    position: relative;
                    display: inline-block;
                }
                .dayRange .legend .year .month .week.skip,
                .dayRange .legend .year .month .week.seven-days {
                    border-left: 1px dotted #5d5d5d;
                }
                .dayRange .legend .year .month .week .name {
                    position: absolute;
                }
                .dayRange .legend .year .month .week.skip .name {
                    display: none;
                }
                .dayRange .legend .year .month .week .day {
                    position: absolute;
                    top: 20px;
                    height: 18px;
                    width: max-content;
                    padding: 1px 5px;
                    color: #5d5d5d;
                    background: #a7a7a7;
                }
                .dayRange .legend .year .month .week .day span {
                    position: absolute;
                    left: 0;
                    top: 20px;
                    height: 40px;
                    width: ${this.state.dayWidth}px;
                    background: #a7a7a7;
                }
                .dayRange .legend .year .month .week.one-days {
                    width: ${this.state.dayWidth}px;
                }
                .dayRange .legend .year .month .week.one-days.skip {
                    width: ${this.state.dayWidth - 1}px;
                }
                .dayRange .legend .year .month .week.one-days .name {
                    left: -${6 * this.state.dayWidth}px;
                }
                .dayRange .legend .year .month .week.two-days {
                    width: ${2 * this.state.dayWidth}px;
                }
                .dayRange .legend .year .month .week.two-days.skip {
                    width: ${(2 * this.state.dayWidth) - 1}px;
                }
                .dayRange .legend .year .month .week.two-days .name {
                    left: -${5 * this.state.dayWidth}px;
                }
                .dayRange .legend .year .month .week.three-days {
                    width: ${3 * this.state.dayWidth}px;
                }
                .dayRange .legend .year .month .week.three-days.skip {
                    width: ${(3 * this.state.dayWidth) - 1}px;
                }
                .dayRange .legend .year .month .week.three-days .name {
                    left: -${4 * this.state.dayWidth}px;
                }
                .dayRange .legend .year .month .week.four-days {
                    width: ${4 * this.state.dayWidth}px;
                }
                .dayRange .legend .year .month .week.four-days.skip {
                    width: ${(4 * this.state.dayWidth) - 1}px;
                }
                .dayRange .legend .year .month .week.four-days .name {
                    left: -${3 * this.state.dayWidth}px;
                }
                .dayRange .legend .year .month .week.five-days {
                    width: ${5 * this.state.dayWidth}px;
                }
                .dayRange .legend .year .month .week.five-days.skip {
                    width: ${(5 * this.state.dayWidth) - 1}px;
                }
                .dayRange .legend .year .month .week.five-days .name {
                    left: -${2 * this.state.dayWidth}px;
                }
                .dayRange .legend .year .month .week.six-days {
                    width: ${6 * this.state.dayWidth}px;
                }
                .dayRange .legend .year .month .week.six-days.skip {
                    width: ${(6 * this.state.dayWidth) - 1}px;
                }
                .dayRange .legend .year .month .week.six-days .name {
                    left: -${this.state.dayWidth}px;
                }
                .dayRange .legend .year .month .week.seven-days {
                    width: ${(7 * this.state.dayWidth) - 1}px;
                }
                .dayRange .legend .year .month .week.seven-days .name {
                    left: 0;
                }
                .dayRange .processes,
                .dayRange .events {
                    position: relative;
                }
                .dayRange .days {
                    position: relative;
                }
            `}</style>
        </div>
    }
}

export default DayRange;