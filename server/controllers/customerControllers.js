const Customer = require('../models/customer');

const createCustomer = async (req, res) => {
    try {
        const { phoneNumber, customerName } = req.body;
        const newCustomer = await Customer.create({
            phoneNumber,
            customerName,
        });

        res.status(201).json({
            message: 'Customer added successfully',
            customer: newCustomer
        });
    } catch (err) {
        console.error('Error adding customer:', err);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

const fetchCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json({ customers });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const fetchCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ customer });
    } catch (error) {
        console.error('Error retrieving customer:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const checkCustomer = async (req, res) => {
    try {
        const phoneNumber = req.params.number;
        const existingCustomer = await Customer.findOne({ phoneNumber })
        if(existingCustomer){
            res.json({ exists: !!existingCustomer, _id: existingCustomer._id});
        }
        else{
            res.json({ exists: !!existingCustomer});
        }
    } catch (error) {
        console.error('Error checking customer existence:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const { phoneNumber, customerName } = req.body;
        const updatedCustomer = await Customer.findByIdAndUpdate(
            customerId,
            {
                phoneNumber: phoneNumber,
                customerName: customerName,
            },
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ customer: updatedCustomer });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

const blacklistCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const updatedCustomer = await Customer.findByIdAndUpdate(
            customerId,
            {
                blacklist: true
            },
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ customer: updatedCustomer });
    } catch (error) {
        console.error('Error blacklisting customer:', error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
    fetchCustomer,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    checkCustomer,
    blacklistCustomer
};