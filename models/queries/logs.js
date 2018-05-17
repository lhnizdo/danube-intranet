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

const LogType = new GraphQLObjectType({
    name: 'LogType',
    description: 'Log object definition',
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
        logs: {
            type: new GraphQLList(LogType),
            resolve: async (req) => {
                const result = await getQuery(sequelize.model('Log'), {
                    order: [
                        ['created_at', 'DESC']
                    ],
                });
                return result.response;
            },
        },
        logs_by_application: {
            type:  GraphQLList(LogType),
            args: {
                application_uuid: {
                    name: 'application_uuid',
                    type: GraphQLString,
                },
            },
            resolve: async (req, payload) => {
                if (payload && payload.application_uuid) {
                    return sequelize.model('Log').findAll({where: {
                        application_uuid: payload.application_uuid,
                    }});
                }

                return [];
            },
        }
    },
};