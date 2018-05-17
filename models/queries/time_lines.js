import {
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} from "graphql";
import {
    getQuery,
    createQuery,
} from "../helpers/db";
import graphQlModelMapper from "../helpers/graphQlModelMapper";

const path = require('path');
const model = require(__dirname + '/../schemas/' + path.basename(__filename));
const Sequelize = require('sequelize');
const sequelize = require('../').sequelize;

const TimeLineType = new GraphQLObjectType({
    name: 'TimeLineType',
    description: 'TimeLine object definition',
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
        time_lines: {
            type: new GraphQLList(TimeLineType),
            resolve: async (req) => {
                const result = await getQuery(sequelize.model('TimeLine'), {
                    order: [
                        ['name', 'ASC']
                    ],
                });
                return result.response;
            },
        },
    },
    mutations: {
        add_time_line: {
            type: TimeLineType,
            args: {
                name: {
                    name: 'name',
                    type: GraphQLString
                },
                description: {
                    name: 'description',
                    type: GraphQLString
                },
            },
            resolve: async (req, payload) => {
                const result = await createQuery(sequelize.model('TimeLine'), payload);
                return result.response;
            }
        }
    }
};