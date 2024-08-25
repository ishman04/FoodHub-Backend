const AppError = require("./appError");

class UnauthorizedLoginError extends AppError{
    constructor(){
        super(`User not authorized properly`,401);
    }
}
module.exports = UnauthorizedLoginError