export const createUserValidationSchema = {
    username: {
        isLength : {
            options:{
                min:5,
                max: 32
            },
            errorMessage: "Must be atleast of length 5 and maximum 32"
        },
        notEmpty: {
            errorMessage:"Username cannot be empty"
        },
        isString: {
            errorMessage: "Username must be a string"
        }
    },
    displayName: true
}