import Layout from './layout';

import React, { Component } from 'react';

import { graphql, ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import fetch from 'node-fetch';

const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://idea-ict-devel.cz:3000/graphql',
        fetch: fetch
    }),
    cache: new InMemoryCache()
});

function prepareComponent(component) {
    if (component && (typeof component === "object") && component.props) {
        if (component.props.query) {
            const ComponentWithoutData = (props) => {
                if (props.data) {
                    if (props.data.error) {
                        return (
                            <div className="error">Error loading data!</div>
                        );
                    }

                    if (props.data.loading) {
                        //props.data.refetch();
                        return (
                            <div className="info">Loading data...</div>
                        );
                    }

                    let values = props.data[component.props.dataKey];

                    if (!Array.isArray(values)) {
                        switch (typeof values) {
                            case "string":
                                values = JSON.parse(values);
                                break;

                            default:
                                break;
                        }
                    }

                    component.props[component.props.dataProperty] = values;
                    component.props.data = props.data;
                }

                return component;
            };

            const variables = component.props.variables ? component.props.variables : null;
            const options =  {
                notifyOnNetworkStatusChange: true,
                pollInterval: component.props.pollInterval,
            };

            if (variables) {
                options.variables = variables;
            }

            const ComponentWithData = graphql(component.props.query, { options: options })(ComponentWithoutData);

            return (
                <ComponentWithData key={"componentWithData_" + Math.random()} />
            );
        } else if (component.props.children) {
            let children = React.Children.map(component.props.children, (child, i) => {
                return prepareComponent(child);
            });

            return React.createElement(component.type, component.props, children);
        }
    }

    return component;
}

class LayoutWithData extends Component {
    constructor(props) {
        super(props);

        this.renderChildren = this.renderChildren.bind(this);
    }
    renderChildren() {
        return React.Children.map(this.props.children, (child) => {
            return prepareComponent(child);
        });
    }
    render() {
        return (
            <ApolloProvider client={client}>
                <Layout>
                    {this.renderChildren()}
                    <style global jsx>{`
                    .clear {
                        clear: both;
                    }
                    .center {
                        height: 100%
                        max-width: 1300px;
                        margin: 0 auto;
                    }
                `}</style>
                </Layout>
            </ApolloProvider>
        );
    }
}

export default LayoutWithData;