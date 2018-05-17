import {
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} from "graphql";
import {
    getQuery
} from "../helpers/db";
import graphQlModelMapper from "../helpers/graphQlModelMapper";

const path = require('path');
const model = require(__dirname + '/../schemas/' + path.basename(__filename));
const Sequelize = require('sequelize');
const sequelize = require('../').sequelize;

const RoleType = new GraphQLObjectType({
    name: 'RoleType',
    description: 'Role object definition',
    fields: () => Object.assign(
        graphQlModelMapper(model(Sequelize.DataTypes)),
        {
            createdAt: {
                type: GraphQLString,
            },
            updatedAt: {
                type: GraphQLString,
            },
        }),
});

module.exports = {
    queries: {
        roles: {
            type: new GraphQLList(RoleType),
            resolve: async (req) => {
                const result = await  getQuery(sequelize.model('Role'), {
                    order: [
                        ['name', 'ASC']
                    ],
                });

                return result.response;
            },
        },
    }
};