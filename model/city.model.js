import mongoose from "mongoose"
const citySchema = new mongoose.Schema({
    cityName: {
        type: String,
        required: true,
    },
    cityCode: {
        type: String,
        unique: true,
        required: true,
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'state',
        required: true
    },
    status: {
        type: {
            _id: {type: String, required: true},
            name: {type: String, required: true}
        },
        default: { _id: '1', name: 'Active' }
    },
},{timestamps: true})

citySchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    },
});

const city = mongoose.model("city", citySchema)
export default city;