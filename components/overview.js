import React, { Component } from 'react';
import OverviewHeader from "./overview_header";
import OverviewList from "./overview_list";
import OverviewButtons from "./overview_buttons";

const numberToText = require('number-to-text');
require('number-to-text/converters/en-us');

class Overview extends Component {
    constructor(props) {
        super();

        this.state = {
            columnsClass: numberToText.convertToText(props.columns.length, {separator: "-", case: "lowerCase"}) + "-col"
        };
    }
    render() {
        return (
            <div className={"list " + this.state.columnsClass + (this.props.timeStamp ? (" " + this.props.timeStamp) : "")} id={this.props.id}>
                <OverviewHeader id={this.props.id} columns={this.props.columns} title={this.props.title} image={this.props.image} />
                    {(this.props.items && this.props.items.length > 0)
                        ? <OverviewList id={this.props.id} columns={this.props.columns} items={this.props.items} whitelist={this.props.whitelist} link={this.props.link} />
                        : <p>Overview is empty at this moment...</p>
                    }
                <OverviewButtons id={this.props.id} hideShowAllButton={this.props.hideShowAllButton}>
                    {React.Children.map(this.props.children, child => {
                        if (!this.props.requiresItems || (this.props.items && this.props.items.length > 0)) {
                            return child;
                        }
                    })}
                </OverviewButtons>
                <style global jsx>{`
                    .list {
                        padding-bottom: 100px;
                        color: #ffffff;
                        font-size: 14px;
                        line-height: 1.5;
                    }
                `}</style>
            </div>
        );
    }
}

export default Overview;