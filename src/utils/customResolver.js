import { Resolver, FieldError } from "react-hook-form";
import get from "lodash/get";
import IOpportunity from "../interfaces/IOpportunity";

function validateLength(
    name,
    value,
    errors
) {
    // Perform a custom validation depending on field name
    const minLength = 3;

    if (!value || value.length < minLength) {
        return {
            ...errors,
            [name]: {
                type: `min-length-${minLength}`,
                message: `O campo "${name}" precisa ter pelo menos ${minLength} caracteres`
            }
        };
    }

    return errors;
}

export const customResolver = (
    values,
    _context,
    { names }
) => {
    let errors = {};
    if (names) {
        // Validate only changed fields
        errors = names.reduce((acc, name) => {
            const value = get(values, name);

            return validateLength(name, value, acc);
        }, {});
    } else {
        // Validate all fields on submit event
        errors = Object.entries(values).reduce(
            (acc, [name, value]) => validateLength(name, value, acc),
            {}
        );
    }

    return { values, errors };
};
