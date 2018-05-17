import React, { Component } from 'react';

class OnChangeInput extends Component {
    render() {
        return (
            <input onChange={this.props.onChange} type={this.props.type} name={this.props.name} value={this.props.value} placeholder={this.props.placeholder} />
        );
    }
}

export default OnChangeInput;