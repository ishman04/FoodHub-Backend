const AppError = require("./appError");

class InternalServerError extends AppError{
    constructor(){
        super(`Something went wrong on our server`,500);
    }
}
module.exports = InternalServerError