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

const UserType = new GraphQLObjectType({
    name: 'UserType',
    description: 'User object definition',
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
        current_user: {
            type: new GraphQLList(UserType),
            resolve: async (req) => {
                const result = await getQuery(sequelize.model('User'), {
                    order: [
                        ['email', 'ASC']
                    ],
                    where: {
                        email: req && req.user && req.user.email,
                    },
                });
                return result.response;
            },
        },
        users: {
            type: GraphQLString,
            resolve: async (req) => {
                const result = await getQuery(sequelize.model('User'), {
                    order: [
                        ['email', 'ASC']
                    ],
                    attributes: {
                        include: [
                            [sequelize.fn("CONCAT", sequelize.col("first_name"), ' ', sequelize.col("last_name")), 'full_name']
                        ],
                    }
                });
                return JSON.stringify(result.response);
            },
        },
        users_for_select: {
            type: GraphQLString,
            resolve: async (req) => {
                const result = await getQuery(sequelize.model('User'), {
                    order: [
                        ['last_name', 'ASC'],
                        ['first_name', 'ASC'],
                    ],
                    attributes: [
			['uuid', 'value'],
            		[sequelize.fn("CONCAT", sequelize.col("first_name"), ' ', sequelize.col("last_name")), 'label']
                    ]
                });
                return JSON.stringify(result.response);
            },
        },
    }
};