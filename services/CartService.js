const createError = require('http-errors');
const CartModel = require('../models/cart');
const OrderModel = require('../models/order');
const CartItemModel = require('../models/cartItem');
const { STRIPE_KEY } = require('../config');

module.exports = class CartService {

    async create(data) {
        const { userId } = data;

        try {

            //Instantiate new cart and save
            const Cart = new CartModel();
            const cart = await Cart.create(userId);

            return cart;

        } catch(err) {
            throw err;
        }
    }

    async loadCart(userId) {
        try {

            // Load user cart by ID
            const cart = await CartModel.findOneByUser(userId);

            // Load cart items and add them to the cart record
            const items = await CartItemModel.find(cart.id);
            cart.items = items;

            return cart;

        } catch(err) {
            throw err;
        }
    }

    async addItem(userId, item) {
        try {

            // Load user cart by ID
            const cart = await CartModel.findOneByUser(userId);

            // Load cart items and add them to the cart record
            const cartItem = await CartItemModel.create({ cartId: cart.id, ...item });

            return cartItem;

        } catch(err) {
            throw err;
        }
    }

    async removeItem(cartItemId) {
        try {

            // Remove cart item by line ID
            const cartItem = await CartItemModel.delete(cartItemId);

            return cartItem;

        } catch(err) {
            throw err;
        }
    }

    async updateItem(cartItemId, data) {
        try {

            // update cart item by line ID
            const cartItem = await CartItemModel.update(cartItemId, data);

            return cartItem;

        } catch(err) {
            throw err;
        }
    }

    async checkout(cartId, userId, paymentInfo) {
        try {

            const stripe = require('stripe')(STRIPE_KEY);

            // Load cart items
            const cartItems = await CartItemModel.find(cartId);

            // Generate total price from cart items
            const total = cartItems.reduce((total, item) => {
                return total += Number(item.price);
            }, 0);

            // Generate initial order
            const Order = new OrderModel({ total, userId });
            Order.addItems(cartItems);
            await Order.create();

            // Make charge to payment method
            const charger = await stripe.charges.create({
                amount: total,
                currency: 'usd',
                source: paymentInfo.id,
                description: 'Codecademy Charge'
            });

            // On successful charge to payment method, update order status to COMPLETE
            const order = Order.update({ status: 'COMPLETE' });

            return order;

        } catch(err) {
            throw err;
        }
    }
}