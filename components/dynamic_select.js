import React, { Component } from 'react';

class DynamicSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
        };
    }
    render() {
        if (this.props.data) {
            let items = this.props.data[this.props.dataKey];

            if (!Array.isArray(items)) {
                switch (typeof items) {
                    case "string":
                        items = JSON.parse(items);
                        break;

                    default:
                        items = [];
                        break;
                }
            }

            if (this.props.filter) {
                items = items.filter(item => (item.filter == this.props.filter));
            }

            const selectedValues = this.state.value ? items.filter(item => (item.value == this.state.value)) : null;
            const selectedValue = (Array.isArray(selectedValues) && selectedValues.length > 0) ? selectedValues.pop() : null;

            if (items.length > 0) {
                return <select id={this.props.id} name={this.props.name} value={selectedValue ? selectedValue.value : undefined} className={this.props.className} ref={this.props.ref} onChange={(event) => {
                    if (event && event.target && event.target.selectedIndex > 0 && event.target.selectedIndex <= items.length) {
                        const value = items[event.target.selectedIndex - 1].value;

                        this.setState({value: value}, () => {
                            this.props.onChange({target: {name: this.props.name, value: value}});
                        });
                    }
                }}>
                    <option>-- Please select --</option>
                    {this.props.data.error ?
                        <option value="" disabled>Error loading data!</option> :
                        (this.props.data.loading ?
                                <option value="" disabled>Loading data...</option> :
                                items.map(item => (<option key={"option_" + Math.random()} value={item.value}>{item.label}</option>))
                        )}
                </select>
            } else {
                return <input type="text" id={this.props.id} name={this.props.name} className={this.props.className}
                              value={this.props.value} ref={this.props.ref} onChange={this.props.onChange}/>
            }
        }
    }
}

export default DynamicSelect;