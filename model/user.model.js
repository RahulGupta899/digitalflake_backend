import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
},{timestamps: true})

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
    },
});

const user = mongoose.model("user", userSchema)
export default user;