import {
    GraphQLInt,
    GraphQLString,
    GraphQLID
} from 'graphql';

import GraphQLJSON from 'graphql-type-json';
import GraphQLDateType from './graphql-type-date';

export default function graphQlModelMapper(table, exclude) {
    const tableRemapToGraphQl = Object.keys(table)
        .map(column => ({
            [column]: {
                type: table[column].type.key,
            },
        }))

        .map((column) => {
            const newColumn = column;
            const columnName = Object.keys(column)[0];

            switch (newColumn[columnName].type) {
                case 'INTEGER':
                    newColumn[columnName].type = GraphQLInt;
                    break;

                case 'DATE':
                    newColumn[columnName].type = GraphQLDateType;
                    break;

                case 'STRING':
                case 'TEXT':
                    newColumn[columnName].type = GraphQLString;
                    break;

                case 'JSON':
                    newColumn[columnName].type = GraphQLJSON;
                    break;

                case 'UUID':
                    newColumn[columnName].type = GraphQLID;
                    break;

                default:
                    console.log("Unknown column type: " + newColumn[columnName].type);
                    console.log(table);
                    break;
            }

            return newColumn;
        });

    const graphQlObject = {};

    tableRemapToGraphQl.forEach((column) => {
        Object.assign(graphQlObject, column);
    });

    return graphQlObject;
}
