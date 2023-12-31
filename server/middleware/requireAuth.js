const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.sendStatus(401);
        }

        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET);
        
        if(Date.now() > decoded.exp) return res.sendStatus(401);

        const user = await User.findById(decoded.sub);
        if(!user) return res.sendStatus(401);
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