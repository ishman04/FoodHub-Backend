class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async registerUser(userDetails) {
        const user = await this.userRepository.findUser({
            email: userDetails.email,
            mobileNumber: userDetails.mobileNumber
        });

        if (user) {
            throw { reason: "User already exists", statusCode: 400 };
        }

        const newUser = await this.userRepository.createUser({
            email: userDetails.email,
            password: userDetails.password,
            lastName: userDetails.lastName,
            firstName: userDetails.firstName,
            mobileNumber: userDetails.mobileNumber
        });

        if (!newUser) {
            throw { reason: "Failed to create user", statusCode: 500 };
        }

        return newUser;
    }
}

module.exports = UserService;
