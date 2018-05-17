import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
const dateFormat = require('dateformat');

export default new GraphQLScalarType({
    name: 'Date',
    serialize(value) {
        value = new Date(value);
        return dateFormat(value, 'mm/dd/yyyy hh:MM TT');
    },
    parseValue(value) {
        return new Date(value);
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return parseInt(ast.value, 10);
        }
        return null;
    }
});