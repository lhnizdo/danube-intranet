import {
    GraphQLObjectType,
    GraphQLSchema
} from "graphql";

const queries = require(__dirname + '/../queries');

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            ...queries.queries
        },
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            ...queries.mutations,
        },
    }),
});