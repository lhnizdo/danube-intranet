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

const TaskStatusType = new GraphQLObjectType({
    name: 'TaskStatusType',
    description: 'TaskStatus object definition',
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
        task_statuses: {
            type: new GraphQLList(TaskStatusType),
            resolve: async (req) => {
                const result = await getQuery(sequelize.model('TaskStatus'), {
                    order: [
                        ['uuid', 'ASC']
                    ],
                });
                return result.response;
            },
        },
    }
};