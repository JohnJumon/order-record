const Order = require('../models/order');

const createOrder = async (req, res) => {
    try {
        const { customer, items, statusCount, deposit, isPaidOff } = req.body;
        const newOrder = await Order.create({
            customer,
            items: items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                description: item.description
            })),
            statusCount,
            deposit,
            isPaidOff,
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
        const { customerId, searchTerm, statusFilter, paymentFilter, startDate, endDate } = req.query;

        let query = {};

        if (customerId) {
            query['customer'] = customerId;
        }

        if (statusFilter !== undefined && statusFilter !== '') {
            query['statusCount.' + statusFilter] = { $gt: 0 };
        }

        if (paymentFilter !== undefined && paymentFilter !== '') {
            query['isPaidOff'] = paymentFilter == 1;
        }

        if (startDate && endDate) {
            query['orderDate'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        let orders;

        if (searchTerm) {
            orders = await Order.find(query).populate('customer').populate('items.product');
            orders = orders.filter(order =>
                order.customer.customerName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else {
            orders = await Order.find(query).populate('customer').populate('items.product');
        }

        res.json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const fetchOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId).populate('customer').populate({
            path: 'items.product',
            model: 'Product',
          });

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
      const { customer, items, deposit, isPaidOff, statusCount } = req.body;
  
      const populatedItems = await Order.populate(items, { path: 'product', model: 'Product' });
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          customer,
          items: populatedItems.map(item => ({
            product: item.product,
            quantity: item.quantity,
            status: item.status,
            size: item.size,
            color: item.color,
            description: item.description
          })),
          deposit,
          isPaidOff,
          statusCount,
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
  };

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
