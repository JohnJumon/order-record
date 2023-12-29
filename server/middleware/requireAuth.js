const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers['Authorization'];

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.sendStatus(401);
        }

        const token = authorizationHeader.substring(7)
        const decoded = jwt.verify(token, process.env.SECRET);
        
        if(Date.now() > decoded.exp) return res.sendStatus(401);

        const user = await User.findById(decoded.sub);
        if(!user) return res.sendStatus(401);
        res.header('Access-Control-Allow-Credentials', true)
        req.user = user
        next();
    } catch (error) {
        console.error('Auth failed:', error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }

};

module.exports = requireAuth;