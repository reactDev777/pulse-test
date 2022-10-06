/**
 * schema validation for bulk create assignments
 * @param {Object | Array<Object>} body
 * @param {Object} res
 * @return void
 */
import { badRequest } from '@hapi/boom';
import { ObjectSchema } from 'joi';

export const validateSchema = (body: any, schema: ObjectSchema) => {
    const { error, value } = schema.validate(body);
    if (error) {
        throw badRequest(
            `Validation error: ${error.details
                .map((x) => x.message)
                .join(', ')}`
        );
    }
    return value;
};
