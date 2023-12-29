const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({username});
        if(!user) return res.sendStatus(401);
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if(!passwordMatch) return res.sendStatus(401);
        const exp = Date.now() + 1000 * 60 * 60 * 12
        const token = jwt.sign({ sub: user._id, exp }, process.env.SECRET)
        res.header('Authorization', `Bearer ${token}`);
        res.header('Access-Control-Allow-Credentials', true)
        res.sendStatus(200);
    } catch (error){
        console.error('Login failed:', error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const logout = (req, res) => {
    res.clearCookie("Authorization")
    res.sendStatus(200);
}

const checkAuth = (req, res) => {
    res.sendStatus(200);
}

module.exports = {
    login,
    logout,
    checkAuth
}