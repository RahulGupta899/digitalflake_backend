import City from "../model/city.model.js";
import mongoose from "mongoose";

const getAllCities = async (req, res) => {
    try {
        // Extract query parameters
        const { searchText, status, stateCode } = req.query;
        // Match Criteria
        const matchCriteria = {};
        if (searchText) {
            matchCriteria['$or'] = [
                { cityName: { $regex: searchText, $options: "i" } },
                { cityCode: { $regex: searchText, $options: "i" } }
            ];
        }
        if (status) {
            matchCriteria['status._id'] = status;
        }
        // Create aggregation pipeline
        const pipeline = [
            {
                $match: matchCriteria
            },
            {
                $lookup: {
                    from: 'states',
                    localField: 'state',
                    foreignField: '_id',
                    as: 'stateDetails'
                }
            },
            {
                $unwind: '$stateDetails'
            },
            // Filter based on stateCode if provided
            ...(stateCode
                ? [
                    {
                        $match: { 'stateDetails.stateCode': stateCode }
                    }
                ]
                : []),
            {
                $sort: { createdAt: -1 }
            }
        ];
        // Fetch DB
        const cities = await City.aggregate(pipeline);

        return res.status(200).json({
            error: false,
            data: {
                list: cities
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: true,
            message: err.message
        });
    }
};

const getSingle = async (req, res) => {
    try {
        // Checking Id Integrity
        const { id } = req.params;
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidId) {
            throw new Error('Invalid Id')
        }
        // City
        const city = await City.findById(id).populate("state")
        if (!city) {
            return res.status(400).json({
                error: true,
                message: "City does not exists"
            })
        }
        res.status(200).json({
            error: false,
            data: {
                city,
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
        const city = await City.findByIdAndDelete(id,{new: true})
        res.status(200).json({
            error: false,
            data: {
                city,
                message: 'City deleted successfully'
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

const createNewCity = async (req, res) => {
    try {
        // Payload Integrity
        let { cityName, cityCode, state } = req.body;
        if (!cityName || !cityCode || !state) {
            return res.status(400).json({
                error: true,
                message: "Please provide valid payload"
            })
        }
        cityName = cityName.trim();
        cityCode = cityCode.trim();
        // City already exists or not
        const city = await City.findOne({ cityCode })
        if (city) {
            return res.status(400).json({
                error: true,
                message: "City Code already exists"
            })
        }
        // DB Operation
        const newCity = await City.create({
            cityName,
            cityCode,
            state: state?._id
        })
        res.status(201).json({
            error: false,
            message: 'City created cuccessfully',
            data: {
                city: newCity,
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

const updateCity = async (req, res) => {
    try {
        // Checking Id Integrity
        const { id } = req.params;
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidId) {
            throw new Error('Invalid Id')
        }
        // Payload Integrity
        let { cityName, cityCode, state, status } = req.body;
        if (!cityName || !cityCode || !state || !status) {
            return res.status(400).json({
                error: true,
                message: "Please provide valid payload"
            })
        }
        cityName = cityName.trim();
        cityCode = cityCode.trim();
        // User Exists or Not
        const city = await City.findById(id)
        if (!city) {
            return res.status(400).json({
                error: true,
                message: "City does not exists"
            })
        }
        // Checking Unique Key is allowed or not 
        const existingCity = await City.findOne({ cityCode, _id: { $ne: id } });
        if (existingCity) {
            return res.status(400).json({
                error: true,
                message: `Duplicate cityCode: ${cityCode} already exists.`,
            });
        }
        // DB Operation
        const updatedCity = await City.findOneAndUpdate(
            { _id: id },
            { cityName, cityCode, state: state?._id, status, updatedAt: new Date() },
            { new: true });
        res.status(201).json({
            error: false,
            message: 'City Updated Successfully',
            data: {
                state: updatedCity,
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
    getAllCities,
    getSingle,
    deleteRecord,
    createNewCity,
    updateCity
}

