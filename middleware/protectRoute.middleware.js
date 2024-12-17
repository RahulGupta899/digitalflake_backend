import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
const protectedRoute = async (req, res, next) => {
    try {
        let token = req.headers['authorization'] || "";
        token = token.replace(`Bearer `, '')
        if (!token) {
            return res.status(401).json({
                error: true,
                message: "Not authorized, no token provided"
            })
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decode.userId);
        if (!user) {
            return res.status(401).json({
                error: true,
                message: "Not authorized, user doesn't exists"
            })
        }
        req.user = user;
        next();
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: true,
                message: 'Session expired. Please log in again.'
            })
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: true,
                message: 'Invalid token. Access denied.'
            })
        }
        res.status(500).json({
            error: true,
            message: err?.message
        })
    }
}
export default protectedRoute;