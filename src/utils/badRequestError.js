const AppError = require("./appError");

class BadRequestError extends AppError{
    constructor(invalidParams){
        let message = "";
        invalidParams.forEach(param => message += `${param}\n`);
        super(`Your request has the following invalid parameters: ${invalidParams}`,404)
    }
}
module.exports = BadRequestError;