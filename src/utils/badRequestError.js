const AppError = require("./appError");

class BadRequestError extends AppError {
    
    constructor(invalidParams) {
        // Construct the error message by joining all invalid parameters
        console.log("Invalid Params Type:", typeof invalidParams);
        console.log("Invalid Params Value:", invalidParams);

        // Ensure invalidParams is an array or convert it to an array
        if (!Array.isArray(invalidParams)) {
            invalidParams = [invalidParams];
        }
        const message = invalidParams.map(param => `${param}`).join('\n');
        super(`Your request has the following invalid parameters: \n${message}`, 400);
    }
}
module.exports = BadRequestError;