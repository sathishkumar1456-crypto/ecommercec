import Order from '../models/order.js';

export const addOrderItems = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('Process Rejected: Empty Manifest.');
    } else {
      const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        totalPrice,
      });
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusAdmin = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      if (req.body.status === 'Delivered') {
        order.isPaid = true;
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('System Order tracking sequence mismatch.');
    }
  } catch (error) {
    next(error);
  }
};