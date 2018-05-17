import {
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} from "graphql";
import {
    updateQuery,
    createQuery,
} from "../helpers/db";
import graphQlModelMapper from "../helpers/graphQlModelMapper";

const path = require('path');
const model = require(__dirname + '/../schemas/' + path.basename(__filename));
const Sequelize = require('sequelize');
const sequelize = require('../').sequelize;

const ApplicationType = new GraphQLObjectType({
    name: 'ApplicationType',
    description: 'Application object definition',
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
        applications: {
            type: GraphQLString,
            resolve: async (req) => {
                const applications = await sequelize.model('Application').findAll({
                    include: [
                        {
                            model: sequelize.model('ApplicationStatus'),
                            as: 'status'
                        },
                        {
                            model: sequelize.model('User'),
                            attributes: {
                                include: [
                                    [sequelize.fn("CONCAT", sequelize.col("owner.first_name"), ' ', sequelize.col("owner.last_name")), 'full_name']
                                ],
                            },
                            as: 'owner'
                        }],
                    order: [
                        ['updated_at', 'DESC']
                    ]
                });

                return JSON.stringify(applications);
            },
        },
        application_by_uuid: {
            type: ApplicationType,
            args: {
                uuid: {
                    name: 'uuid',
                    type: GraphQLString
                }
            },
            resolve: async (req, payload) => {
                return await sequelize.model('Application').findOne({
                    where: {
                        uuid: payload.uuid
                    }
                });
            }
        },
        running_applications: {
            type:  GraphQLString,
            resolve: async (req) => {
                const applications = await sequelize.model('Application').findAll({
                    include: [
                        {
                            model: sequelize.model('ApplicationStatus'),
                            as: 'status',
                            where: {
                                name: 'running'
                            }
                        },
                        {
                            model: sequelize.model('User'),
                            as: 'owner'
                        }]
                });

                return JSON.stringify(applications);
            },
        },
        applications_on_hold: {
            type:  GraphQLString,
            resolve: async (req) => {
                const applications = await sequelize.model('Application').findAll({
                    include: [
                        {
                            model: sequelize.model('ApplicationStatus'),
                            as: 'status',
                            where: {
                                name: 'on_hold'
                            }
                        },
                        {
                            model: sequelize.model('User'),
                            as: 'owner'
                        }]
                });

                return JSON.stringify(applications);
            },
        },
        completed_applications: {
            type:  GraphQLString,
            resolve: async (req) => {
                const applications = await sequelize.model('Application').findAll({
                    include: [
                        {
                            model: sequelize.model('ApplicationStatus'),
                            as: 'status',
                            where: {
                                name: 'completed'
                            }
                        },
                        {
                            model: sequelize.model('User'),
                            as: 'owner'
                        }]
                });

                return JSON.stringify(applications);
            },
        },
    },
    mutations: {
        add_application: {
            type: ApplicationType,
            args: {
                name: {
                    name: 'name',
                    type: GraphQLString
                },
                project_id: {
                    name: 'project_id',
                    type: GraphQLString
                },
                due_date: {
                    name: 'due_date',
                    type: GraphQLString
                },
            },
            resolve: async (req, payload) => {
                const status = await sequelize.model('ApplicationStatus').findOne({
                    where: {
                        name: 'unstarted'
                    }
                });

                payload.status_uuid = status.uuid;

                if (sequelize.request.isAuthenticated() && sequelize.request.user) {
                    payload.owner_uuid = sequelize.request.user.uuid;

                    const result = await createQuery(sequelize.model('Application'), payload);

                    if (result) {
                        return result.response;
                    }
                }

                return null;
            }
        },
        update_application: {
            type: ApplicationType,
            args: {
                uuid: {
                    name: 'uuid',
                    type: GraphQLString
                },
                name: {
                    name: 'name',
                    type: GraphQLString
                },
                project_id: {
                    name: 'project_id',
                    type: GraphQLString
                },
                due_date: {
                    name: 'due_date',
                    type: GraphQLString
                },
                description: {
                    name: 'description',
                    type: GraphQLString
                },
                status_uuid: {
                    name: 'status_uuid',
                    type: GraphQLString
                }
            },
            resolve: async (req, payload) => {
                const argument = {uuid: payload.uuid};
                delete payload["uuid"];

                const result = await updateQuery(sequelize.model('Application'), payload, argument);

                let application = {};

                if (result && result.response) {
                    application = await sequelize.model('Application').findOne({
                        where: {
                            uuid: argument.uuid
                        }
                    });
                }

                return application;
            }
        }
    }
};