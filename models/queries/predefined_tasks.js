import {
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} from "graphql";
import {
    getQuery,
} from "../helpers/db";
import graphQlModelMapper from "../helpers/graphQlModelMapper";

const path = require('path');
const model = require(__dirname + '/../schemas/' + path.basename(__filename));
const Sequelize = require('sequelize');
const sequelize = require('../').sequelize;

const PredefinedTaskType = new GraphQLObjectType({
    name: 'PredefinedTaskType',
    description: 'PredefinedTask object definition',
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
        predefined_tasks: {
            type: new GraphQLList(PredefinedTaskType),
            resolve: async (req) => {
                const result = await getQuery(sequelize.model('PredefinedTask'), {
                    order: [
                        ['name', 'ASC']
                    ],
                });
                return result.response;
            },
        },
        tasks_by_time_line: {
            type:  GraphQLList(PredefinedTaskType),
            args: {
                time_line_uuid: {
                    name: 'time_line_uuid',
                    type: GraphQLString,
                },
            },
            resolve: async (req, payload) => {
                if (payload && payload.time_line_uuid) {
                    return sequelize.model('PredefinedTask').findAll({where: {
                        time_line_uuid: payload.time_line_uuid,
                    }});
                }

                return [];
            },
        }
    },
};