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
        res.status(200).json({ token: token });
    } catch (error){
        console.error('Login failed:', error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const logout = (req, res) => {
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