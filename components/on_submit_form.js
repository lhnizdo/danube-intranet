import React, { Component } from 'react';

class OnSubmitForm extends Component {
    render() {
        return (
            <form onSubmit={this.props.onSubmit} className={this.props.className} id={this.props.id}>
                {this.props.children}
            </form>
        );
    }
}

export default OnSubmitForm;