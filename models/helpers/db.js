export async function getQuery(Table, query = {}) {
    try {
        const response = await Table.findAll(query);
        return {
            response: response.map((record) => {return record.dataValues}),
            message: 'Success'
        }
    }
    catch (e) {
        return {
            response: false,
            message: e.message
        }
    }
}

export async function deleteQuery(Table, arg) {
    try {
        const res = await Table.find(arg);
        if (res) {
            const response = await res.destroy();
            return {
                response: res.dataValues,
                message: 'Success',
            };
        }
        return {
            response: arg,
            message: 'Couldnt find any record',
        };
    } catch (e) {
        return {
            response: false,
            message: e.message,
        };
    }
}

export async function createQuery(Table, payload) {
    try {
        const response = await Table.create(payload);
        return {
            response: response.dataValues,
            self: response,
            message: 'Created'
        }
    }
    catch (e) {
        return {
            response: false,
            message: e.message
        }
    }
}

export async function updateQuery(Table, payload, argument) {
    try {
        const response = await Table.update(payload, {
                where: argument
            },
        );
        if (response[0] !== 0) {
            return {
                response: true,
                self: response,
                message: 'Success',
            };
        }
        return {
            response: false,
            message: 'Couldnt find any record' };
    } catch (e) {
        return {
            response: false,
            message: e.message,
        };
    }
}