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
        const isMaster = user.isMaster
        res.status(200).json({ token: token, isMaster: isMaster });
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
    const isMaster = req.user.isMaster
    res.status(200).json({isMaster: isMaster});
}

const createAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashPassword = bcrypt.hashSync(password)
        const newAdmin = await User.create({
            username: username,
            password: hashPassword,
        });

        res.status(201).json({
            message: 'Admin created successfully',
        });
    } catch (err) {
        console.error('Error creating admin:', err);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const fetchAdmins = async (req, res) => {
    try {
        const users = await User.find({ isMaster: false});
        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const fetchAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const admin = await User.findById(adminId);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({ admin });
    } catch (error) {
        console.error('Error retrieving admin:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const checkAdmin = async (req, res) => {
    try {
        const username = req.params.username;
        const existingAdmin = await User.findOne({ username })
        if (existingAdmin) {
            res.json({ exists: !!existingAdmin, _id: existingAdmin._id });
        }
        else {
            res.json({ exists: !!existingAdmin });
        }
    } catch (error) {
        console.error('Error checking admin existence:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const { username, password, wantChange } = req.body;
        if(wantChange){
            const hashPassword = bcrypt.hashSync(password)
            const updatedAdmin = await User.findByIdAndUpdate(
                adminId,
                {
                    username: username,
                    password: hashPassword
                },
                { new: true }
            );
            if (!updatedAdmin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
        }
        else{
            const updatedAdmin = await User.findByIdAndUpdate(
                adminId,
                {
                    username: username,
                },
                { new: true }
            );
            if (!updatedAdmin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
        }

        res.sendStatus(200)
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
    login,
    logout,
    checkAuth,
    createAdmin,
    fetchAdmins,
    fetchAdmin,
    checkAdmin,
    updateAdmin,
}