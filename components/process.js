import React, { Component } from 'react';

class Process extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let start = this.props.start ? this.props.start : 0;
        let size = this.props.size ? this.props.size : 0;

        let dayWidth = parseInt(this.props.dayWidth);

        let left = (start * dayWidth) - 1;
        let width = (size * dayWidth) + dayWidth - 1;

        return (<div className={"process " + this.props.status} onClick={this.handleClick}>
            {(this.props.process && this.props.process.name) ? (<span className="name">{this.props.process.name}</span>) : null}
            <style jsx>{`
            .process {
                position: absolute;
                left: ${left}px;
                top: 45px;
                width: ${width}px;
                height: 40px
                border-radius: 5px;
                border: 1px solid #ffffff;
                background-color: #9D9D9D;
                opacity: 0.85;
            }
            .process:hover {
                box-shadow: 0px 0px 5px #ffffffff;
            }
            .process.approved {
                background-color: #C8DB8B;
            }
            .process .name {
                position: absolute;
                left: 2px;
                top: -20px;
                color: #ffffff;
                width: max-content;
                font-size: 0.8em;
            }
        `}</style>
        </div>);        
    }
};

export default Process;