import 'dotenv/config';
import('./db/connectDB.js').then((module) => module.default());
import express from 'express';
import authRoutes from './route/auth.route.js';
import stateRoutes from './route/state.route.js';
import cityRoutes from './route/city.route.js'
import warehouseRoutes from './route/warehouse.route.js';
import cors from 'cors';
const app = express()
const { PORT } = process.env
////////////////////////////////
// Middlewares
///////////////////////////////
app.use(express.json())
app.use(cors())
////////////////////////////////
// Routes
///////////////////////////////
app.use('/api', authRoutes)
app.use('/api', stateRoutes)
app.use('/api', cityRoutes)
app.use('/api', warehouseRoutes)
app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: 'Server is running ✅',
        uptime: process.uptime(),
        timeStamp: new Date().toISOString()
    })
})

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT} ✅`)
})