import mongoose from "mongoose"
const wareHouseSchema = new mongoose.Schema({
    wareHouseName: {
        type: String,
        required: true,
        unique: true
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'state',
        required: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'city',
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

wareHouseSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    },
});

const wareHouse = mongoose.model("warehouse", wareHouseSchema)
export default wareHouse;