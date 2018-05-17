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

const EventType = new GraphQLObjectType({
    name: 'EventType',
    description: 'Event object definition',
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
        events: {
            type: new GraphQLList(EventType),
            resolve: async (req) => {
                const result = await getQuery(sequelize.model('Event'), {
                    order: [
                        ['name', 'ASC']
                    ],
                });
                return result.response;
            },
        },
        events_by_application: {
            type:  GraphQLList(EventType),
            args: {
                application_uuid: {
                    name: 'application_uuid',
                    type: GraphQLString,
                },
            },
            resolve: async (req, payload) => {
                if (payload && payload.application_uuid) {
                    return sequelize.model('Event').findAll({where: {
                        application_uuid: payload.application_uuid,
                    }});
                }

                return [];
            },
        }
    },
};