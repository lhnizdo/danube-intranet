import React, { Component } from 'react';

const DAY_WIDTH = 6;

class Day extends Component {
    constructor(props) {
        super(props);
    }
    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }
    render() {
        return (
            <div className={'day' + (this.props.date.getDay() > 0 ? '' : ' sunday') + (this.props.last ? ' last' : '')} style={this.props.last ? {width: this.props.remaining + "px"} : null}>
                {this.isToday(this.props.date) ? (<span className="today"><span className="point">&nbsp;</span></span>) : null}
                <span className='quadrant top' />
                <span className='quadrant bottom' />
                <style jsx>{`
                .day {
                    display: inline-block;
                    height: 40px;
                    width: ${this.props.dayWidth ? this.props.dayWidth : DAY_WIDTH}px;
                    position: relative;
                }
                .day .quadrant {
                    height: 5px;
                    display: block;
                }
                .day .quadrant.top {
                    margin-top: 15px;
                    border-bottom: 1px solid #9D9D9D;
                    border-right: 1px solid #9D9D9D;
                }
                .day .quadrant.bottom {
                    margin-bottom: 15px;
                    border-right: 1px solid #9D9D9D;
                }
                .day.sunday .quadrant {
                    height: 10px;
                }
                .day.sunday .quadrant.top {
                    margin-top: 10px;
                }
                .day.sunday .quadrant.bottom {
                    margin-bottom: 10px;
                }
                .day.last .quadrant.top {
                    border-right: none;
                }
                .day.last .quadrant.bottom {
                    border-right: none;
                }
                .day .date {
                    z-index: 1001;
                    pointer-events: none;
                    position: absolute;
                    top: 0px;
                    left: ${this.props.day * (this.props.dayWidth ? this.props.dayWidth : DAY_WIDTH) - 1}px;
                    height: 65px;
                    border-left: 1px solid rgb(241, 244, 66);
                    display: none;
                    text-align: center;
                    -webkit-user-select: none; /* Safari */
                    -moz-user-select: none; /* Firefox */
                    -ms-user-select: none; /* IE10+/Edge */
                    user-select: none; /* Standard */
                }
                .day.sunday .date {
                    display: inline-block;
                    border: none;
                    top: 25px;
                    width: 26px;
                    left: ${this.props.day * (this.props.dayWidth ? this.props.dayWidth : DAY_WIDTH) - 8}px;
                    height: 40px;
                }
                .day .date .content {
                    display: inline-block;
                    height: 15px;
                    padding: 5px;
                    background-color: rgb(241, 244, 66);
                    color: #3C3C3C;
                }
                .day.sunday .date .content {
                    background: transparent;
                    color: #9D9D9D;
                }
            `}</style>
            </div>
        );        
    }
}

export default Day;