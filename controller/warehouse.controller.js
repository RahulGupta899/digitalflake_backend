import Warehouse from '../model/warehouse.model.js';
import mongoose from 'mongoose';

const getAllWarehouse = async (req, res) => {
    try {
        // Attaching Queries
        const { searchText, status } = req.query;
        const query = {};
        if(searchText){
            query['$or'] = [
                {wareHouseName : {$regex: searchText, $options: "i"}}
            ]
        }
        if(status){
            query['status._id'] = status
        }

        // DB Operation
        const warehouse = await Warehouse.find(query).sort({createdAt: -1}).populate("state city").lean();
        return res.status(200).json({
            error: false,
            data: {
                list: warehouse
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

        // Warehouse
        const warehouse = await Warehouse.findById(id).populate("state city")
        if (!warehouse) {
            return res.status(400).json({
                error: true,
                message: "Warehouse does not exists"
            })
        }

        res.status(200).json({
            error: false,
            data: {
                warehouse,
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

        // Warehouse
        const warehouse = await Warehouse.findByIdAndDelete(id,{new: true})

        res.status(200).json({
            error: false,
            data: {
                warehouse,
                message: 'Warehouse deleted successfully'
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

const createNewWarehouse = async (req, res) => {
    try {
        // Payload Integrity
        let { wareHouseName, state, city } = req.body;
        if (!wareHouseName || !state || !city) {
            return res.status(400).json({
                error: true,
                message: "Please provide valid payload"
            })
        }
        wareHouseName = wareHouseName.trim();

        // Warehouse already exists or not
        const warehouse = await Warehouse.findOne({ wareHouseName })
        if (warehouse) {
            return res.status(400).json({
                error: true,
                message: "Warehouse already exists"
            })
        }

        // DB Operation
        const newWareHouse = await Warehouse.create({
            wareHouseName,
            state,
            city
        })
        res.status(201).json({
            error: false,
            message: 'Warehouse Created Successfully',
            data: {
                warehouse: newWareHouse,
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

const updateWarehouse = async (req, res) => {
    try {
        // Checking Id Integrity
        const { id } = req.params;
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidId) {
            throw new Error('Invalid Id')
        }
        // Payload Integrity
        let { wareHouseName, state, city, status } = req.body;
        console.log({wareHouseName, state, city, status})
        if (!wareHouseName || !state || !city || !status ) {
            return res.status(400).json({
                error: true,
                message: "Please provide valid payload"
            })
        }
        wareHouseName = wareHouseName.trim();
        // Warehouse Exists or Not
        const warehouse = await Warehouse.findById(id)
        if (!warehouse) {
            return res.status(400).json({
                error: true,
                message: "Warehouse does not exists"
            })
        }
        // Checking Unique Key is allowed or not 
        const existingWarehouse = await Warehouse.findOne({ wareHouseName, _id: { $ne: id } });
        if (existingWarehouse) {
            return res.status(400).json({
                error: true,
                message: `Duplicate warehouse: ${wareHouseName} already exists.`,
            });
        }
        // DB Operation
        const updatedWarehouse = await Warehouse.findOneAndUpdate(
            { _id: id },
            { wareHouseName, state, city, status, updatedAt: new Date() },
            { new: true });
        res.status(201).json({
            error: false,
            message: 'Warehouse Updated Successfully',
            data: {
                warehouse: updatedWarehouse,
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
    getAllWarehouse,
    getSingle,
    deleteRecord,
    createNewWarehouse,
    updateWarehouse,
}

