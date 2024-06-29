import mongoose from 'mongoose'

//Enum with the differect roles
const rolesEnum = [
    'admin',
    'premium',
    'user'
]

//Schema for the documents field
const documentSchema = new mongoose.Schema({
    name: String,
    reference: String
});

const usersCollection = 'users'

//The user schema, fullName is composed of firstName and lastName
const userSchema = new mongoose.Schema({
    fullName: {type: String, required: [true, 'Missing field: Name']},
    email: {type: String, required: [true, 'Missing field: Email']},
    age: {type: Number, required: [true, 'Missing field: Age']},
    password: {type: String, required: [true, 'Missing field: Password']},
    role: {type: String, enum: rolesEnum, default:' user'},
    cart: {type: mongoose.Schema.Types.ObjectId, ref: 'carts'},
    documents: {
        profile: [documentSchema],
        products: [documentSchema],
        documents: [documentSchema],
    },
    lastConnection: {type: String}
})

const userModel = mongoose.model(usersCollection, userSchema)

export default userModel