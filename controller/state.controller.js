import State from '../model/state.model.js';
import mongoose from "mongoose";

const getAllStates = async (req, res) => {
    try {
        // Attaching Queries
        const { searchText, status } = req.query;
        const query = {};
        if(searchText){
            query['$or'] = [
                {stateName : {$regex: searchText, $options: "i"}},
                {stateCode: {$regex: searchText, $options: "i"}}
            ]
        }
        if(status){
            query['status._id'] = status
        }
        // DB Operation
        const states = await State.find(query).sort({createdAt: -1}).lean();
        return res.status(200).json({
            error: false,
            data: {
                list: states
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: true,
            message: err.message
        })
    }
}

const getSingle = async (req, res) => {
    try {
        // Checking Id Integrity
        const { id } = req.params;
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidId) {
            throw new Error('Invalid Id')
        }
        // State
        const state = await State.findById(id)
        if (!state) {
            return res.status(400).json({
                error: true,
                message: "State does not exists"
            })
        }
        res.status(200).json({
            error: false,
            data: {
                state,
                message: 'Request processed successfylly.'
            },
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: true,
            message: err.message
        })
    }
}

const deleteRecord = async (req, res) => {
    try {
        // Checking Id Integrity
        const { id } = req.params;
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidId) {
            throw new Error('Invalid Id')
        }
        // State
        const state = await State.findByIdAndDelete(id,{new: true})
        res.status(200).json({
            error: false,
            data: {
                state,
                message: 'State deleted successfully'
            },
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: true,
            message: err.message
        })
    }
}

const createNewState = async (req, res) => {
    try {
        // Payload Integrity
        let { stateName, stateCode } = req.body;
        if (!stateName || !stateCode) {
            return res.status(400).json({
                error: true,
                message: "Please provide valid payload"
            })
        }
        stateName = stateName.trim();
        stateCode = stateCode.trim();
        // State already exists or not
        const state = await State.findOne({ stateCode })
        if (state) {
            return res.status(400).json({
                error: true,
                message: "State Code already exists"
            })
        }
        // DB Operation
        const newState = await State.create({
            stateName,
            stateCode
        })
        res.status(201).json({
            error: false,
            message: 'State Created Successfully',
            data: {
                state: newState,
            },
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: true,
            message: err.message
        })
    }
}

const updateState = async (req, res) => {
    try {
        // Checking Id Integrity
        const { id } = req.params;
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidId) {
            throw new Error('Invalid Id')
        }
        // Payload Integrity
        let { stateName, stateCode, status } = req.body;
        if (!stateName || !stateCode || !status) {
            return res.status(400).json({
                error: true,
                message: "Please provide valid payload"
            })
        }
        stateName = stateName.trim();
        stateCode = stateCode.trim();
        // User Exists or Not
        const state = await State.findById(id)
        if (!state) {
            return res.status(400).json({
                error: true,
                message: "State does not exists"
            })
        }
        // Checking Unique Key is allowed or not 
        const existingState = await State.findOne({ stateCode, _id: { $ne: id } });
        if (existingState) {
            return res.status(400).json({
                error: true,
                message: `Duplicate stateCode: ${stateCode} already exists.`,
            });
        }
        // DB Operation
        const updatedState = await State.findOneAndUpdate(
            { _id: id },
            { stateName, stateCode, status, updatedAt: new Date() },
            { new: true });
        res.status(201).json({
            error: false,
            message: 'State Updated Successfully',
            data: {
                state: updatedState,
            },
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: true,
            message: err.message
        })
    }
}

export default {
    getAllStates,
    getSingle,
    deleteRecord,
    createNewState,
    updateState
}

