import mongoose from "mongoose"
const stateSchema = new mongoose.Schema({
    stateName: {
        type: String,
        required: true,
    },
    stateCode: {
        type: String,
        unique: true,
        required: true,
    },
    status: {
        type: {
            _id: {type: String, required: true},
            name: {type: String, required: true}
        },
        default: { _id: '1', name: 'Active' }
    },
},{timestamps: true})

stateSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    },
});

const state = mongoose.model("state", stateSchema)
export default state;