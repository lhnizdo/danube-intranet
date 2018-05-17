import {GraphQLList, GraphQLObjectType, GraphQLString} from "graphql";
import {getQuery, createQuery, updateQuery, deleteQuery} from "../helpers/db";
import graphQlModelMapper from "../helpers/graphQlModelMapper";

const path = require('path');
const model = require(__dirname + '/../schemas/' + path.basename(__filename));
const Sequelize = require('sequelize');
const sequelize = require('../').sequelize;

const TaskType = new GraphQLObjectType({
    name: 'TaskType',
    description: 'Task object definition',
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
        tasks: {
            type: new GraphQLList(TaskType),
            resolve: async (req) => {
                const result = await getQuery(sequelize.model('Task'), {
                    order: [
                        ['name', 'ASC']
                    ],
                });
                return result.response;
            },
        },
        tasks_including_status_and_user: {
            type:  GraphQLString,
            resolve: async (req, payload) => {
                const result = await getQuery(sequelize.model('Task'), {
                    include: [
                        {
                            model: sequelize.model('TaskStatus'),
                            as: 'status'
                        },
                        {
                            model: sequelize.model('User'),
                            attributes: {
                                include: [
                                    [sequelize.fn("CONCAT", sequelize.col("assigned.first_name"), ' ', sequelize.col("assigned.last_name")), 'full_name']
                                ],
                            },
                            as: 'assigned'
                        }
                    ],
                });

                return JSON.stringify(result.response);
            },
        },
        tasks_by_application: {
            type:  GraphQLString,
            args: {
                application_uuid: {
                    name: 'application_uuid',
                    type: GraphQLString,
                },
                order: {
                    name: 'order',
                    type: GraphQLString,
                },
                direction: {
                    name: 'direction',
                    type: GraphQLString,
                }
            },
            resolve: async (req, payload) => {
                let result = [];

                if (payload && payload.application_uuid) {
                    result = await getQuery(sequelize.model('Task'), {
                        where: {
                            application_uuid: payload.application_uuid,
                        },
                        include: [
                            {
                                model: sequelize.model('TaskStatus'),
                                as: 'status'
                            },
                            {
                                model: sequelize.model('User'),
                                attributes: {
                                    include: [
                                        [sequelize.fn("CONCAT", sequelize.col("assigned.first_name"), ' ', sequelize.col("assigned.last_name")), 'full_name']
                                    ],
                                },
                                as: 'assigned'
                            }
                        ],
                        order: [
                            (payload.order && payload.direction) ? [payload.order, payload.direction] : ['start_date', 'DESC']
                        ]
                    });
                }

                return JSON.stringify(result.response);
            },
        },
        tasks_by_application_and_time_line: {
            type:  GraphQLString,
            args: {
                application_uuid: {
                    name: 'application_uuid',
                    type: GraphQLString,
                },
                time_line_uuid: {
                    name: 'time_line_uuid',
                    type: GraphQLString,
                },
                order: {
                    name: 'order',
                    type: GraphQLString,
                },
                direction: {
                    name: 'direction',
                    type: GraphQLString,
                }
            },
            resolve: async (req, payload) => {
                let result = [];

                if (payload && payload.application_uuid && payload.time_line_uuid) {
                    result = await getQuery(sequelize.model('Task'), {
                        where: {
                            application_uuid: payload.application_uuid,
                            time_line_uuid: payload.time_line_uuid
                        },
                        include: [
                            {
                                model: sequelize.model('TaskStatus'),
                                as: 'status'
                            },
                            {
                                model: sequelize.model('User'),
                                attributes: {
                                    include: [
                                        [sequelize.fn("CONCAT", sequelize.col("assigned.first_name"), ' ', sequelize.col("assigned.last_name")), 'full_name']
                                    ],
                                },
                                as: 'assigned'
                            }
                        ],
                        order: [
                            (payload.order && payload.direction) ? [payload.order, payload.direction] : ['start_date', 'DESC']
                        ]
                    });
                }

                return JSON.stringify(result.response);
            },
        }
    },
    mutations: {
        add_task: {
            type: TaskType,
            args: {
                name: {
                    name: 'name',
                    type: GraphQLString
                },
                description: {
                    name: 'description',
                    type: GraphQLString
                },
                start_date: {
                    name: 'start_date',
                    type: GraphQLString
                },
                duration: {
                    name: 'duration',
                    type: GraphQLString
                },
                assigned_uuid: {
                    name: 'assigned_uuid',
                    type: GraphQLString
                },
                application_uuid: {
                    name: 'application_uuid',
                    type: GraphQLString
                },
                time_line_uuid: {
                    name: 'time_line_uuid',
                    type: GraphQLString
                },
                status_uuid: {
                    name: 'status_uuid',
                    type: GraphQLString
                }
            },
            resolve: async (req, payload) => {
                if (!payload.status_uuid) {
                    const status = await sequelize.model('TaskStatus').findOne({
                        where: {
                            name: 'not_approved'
                        }
                    });

                    payload.status_uuid = status.uuid;
                }

                const result = await createQuery(sequelize.model('Task'), payload);
                return result.response;
            }
        },
        update_task: {
            type: TaskType,
            args: {
                uuid: {
                    name: 'uuid',
                    type: GraphQLString
                },
                name: {
                    name: 'name',
                    type: GraphQLString,
                },
                description: {
                    name: 'description',
                    type: GraphQLString
                },
                start_date: {
                    name: 'start_date',
                    type: GraphQLString
                },
                duration: {
                    name: 'duration',
                    type: GraphQLString
                },
                assigned_uuid: {
                    name: 'assigned_uuid',
                    type: GraphQLString
                },
                application_uuid: {
                    name: 'application_uuid',
                    type: GraphQLString
                },
                time_line_uuid: {
                    name: 'time_line_uuid',
                    type: GraphQLString
                },
                status_uuid: {
                    name: 'status_uuid',
                    type: GraphQLString
                }
            },
            resolve: async (req, payload) => {
                let result = {response: false};

                if (payload.uuid) {
                    Object.keys(payload).forEach(key => {
                        if (key != 'description' && !payload[key]) {
                            delete payload[key];
                        }
                    });

                    result = await updateQuery(sequelize.model('Task'), payload, {
                        uuid: payload.uuid,
                    });
                }

                return result.response;
            }
        },
        delete_task: {
            type: TaskType,
            args: {
                uuid: {
                    name: 'uuid',
                    type: GraphQLString
                },
                name: {
                    name: 'name',
                    type: GraphQLString,
                },
                description: {
                    name: 'description',
                    type: GraphQLString
                },
                start_date: {
                    name: 'start_date',
                    type: GraphQLString
                },
                duration: {
                    name: 'duration',
                    type: GraphQLString
                },
                assigned_uuid: {
                    name: 'assigned_uuid',
                    type: GraphQLString
                },
                application_uuid: {
                    name: 'application_uuid',
                    type: GraphQLString
                },
                time_line_uuid: {
                    name: 'time_line_uuid',
                    type: GraphQLString
                },
                status_uuid: {
                    name: 'status_uuid',
                    type: GraphQLString
                }
            },
            resolve: async (req, payload) => {
                const result = await deleteQuery(sequelize.model('Task'), {where: payload});
                return result.response;
            }
        }
    }
};