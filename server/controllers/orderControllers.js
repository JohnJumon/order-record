const Order = require('../models/order');

const createOrder = async (req, res) => {
    try {
        const { clientName, items, orderStatus } = req.body;
        const newOrder = await Order.create({
            clientName,
            items: items.map(item => ({
                product: item.product,
                quantity: item.quantity
            })),
            orderStatus
        });

        res.status(201).json({
            message: 'Order created successfully',
            order: newOrder
        });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const fetchOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const fetchOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error('Error retrieving order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { clientName, items, orderStatus } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                clientName,
                items: items.map(item => ({
                    product: item.product,
                    quantity: item.quantity
                })),
                orderStatus
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ order: updatedOrder });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const existingOrder = await Order.findById(orderId);

        if (!existingOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await Order.findByIdAndDelete(orderId);
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    fetchOrder,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
};
