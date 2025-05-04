const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');
const { getCart } = require('../helpers/getCart');
const { validationResult } = require('express-validator');

// Add a product to the cart
exports.addToCart = async (req, res) => {
     // Check validation errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(400).json({ error: errors.array() });
     }
    const { productId, quantity, size, color, guestId, userId } = req.body;
    
    try {

        // 1. Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // 2. Get the user's or guest's cart
        const cart = await getCart(userId, guestId);

        // 3. Extract the primary image URL (safely)
        let primaryImage = '';
        if (Array.isArray(product.images)) {
            const primary = product.images.find(img => img.isPrimary);
            primaryImage = primary?.url || product.images[0]?.url || '';
        }

        // 4. If cart exists, update or add product
        if (cart) {
            if (!Array.isArray(cart.products)) {
                cart.products = [];
            }

            // Find matching product in the cart (same ID, size, color)
            const existingItem = cart.products.find(p =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.products.push({
                    productId,
                    price: product.price,
                    name: product.name,
                    image: primaryImage,
                    quantity,
                    size,
                    color
                });
            }

            // Recalculate total price
            cart.totalPrice = cart.products.reduce(
                (sum, item) => sum + item.price * item.quantity, 0
            );

            await cart.save();

            return res.status(200).json({ 
                msg: 'Product successfully added to cart',
                cart 
            });
        }

        // 5. If no cart exists, create one
        const newCart = new Cart({
            user: userId || undefined,
            guestId: guestId || `guest_${Date.now()}`,
            products: [{
                productId,
                price: product.price,
                name: product.name,
                image: primaryImage,
                quantity,
                size,
                color
            }],
            totalPrice: product.price * quantity
        });

        await newCart.save();
        return res.status(200).json({ 
            msg: 'New cart created with product',
            cart: newCart 
        });

    } catch (error) {
        console.error('💥 Cart error:', {
            message: error.message,
            stack: error.stack,
            productId,
            userId,
            guestId
        });

        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
};


// Update cart
exports.updateQuantity = async (req, res) => {
     // Check validation errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(400).json({ error: errors.array() });
     }
     
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {

        // 1. Validate quantity
        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        // 2. Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // 3. Get user's or guest's cart
        const cart = await getCart(userId, guestId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // 4. Find matching item
        const item = cart.products.find(p =>
            p.productId.toString() === productId &&
            p.size === size &&
            p.color === color
        );

        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // 5. Update quantity
        item.quantity = quantity;

        // 6. Recalculate total price
        cart.totalPrice = cart.products.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        await cart.save();

        return res.status(200).json({ 
            msg: 'Cart quantity updated successfully',
            cart 
        });

    } catch (error) {
        console.error('💥 updateQuantity error:', {
            message: error.message,
            stack: error.stack,
            context: { productId, userId, guestId, quantity }
        });

        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
};


// Delete cart item 
exports.deleteCartitem = async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;

    try {
        // 1. Get user's or guest's cart
        const cart = await getCart(userId, guestId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // 2. Filter out the matching item
        const initialLength = cart.products.length;
        cart.products = cart.products.filter(p =>
            !(
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
            )
        );

        if (cart.products.length === initialLength) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // 3. Recalculate total price
        cart.totalPrice = cart.products.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        await cart.save();

        return res.status(200).json({
            msg: "Item successfully removed from cart",
            cart
        });

    } catch (error) {
        console.error('💥 deleteCartitem error:', {
            message: error.message,
            stack: error.stack,
            context: { productId, userId, guestId }
        });

        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
};


// Get all products in the cart
exports.getCart = async (req, res) => {

    const { userId, guestId } = req.query;

    try {

        // 1. Get user's or guest's cart
        const cart = await getCart(userId, guestId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        return res.status(200).json({
            msg: "Cart fetched successfully",
            cart
        });
        

    } catch (error) {
        console.error('💥 deleteCartitem error:', {
            message: error.message,
            stack: error.stack,
            context: { productId, userId, guestId }
        });

        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}

// Merge guest cart to user cart

exports.mergeCart = async (req, res) => {
    const { guestId } = req.body;

    try {
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });

        if (!guestCart) {
            return res.status(404).json({ message: 'Guest cart is empty' });
        }

        if (userCart) {
            // Merge guest cart items into user cart
            guestCart.products.forEach(guestItem => {
                const existingItem = userCart.products.find(userItem =>
                    userItem.productId.toString() === guestItem.productId.toString() &&
                    userItem.size === guestItem.size &&
                    userItem.color === guestItem.color
                );

                if (existingItem) {
                    existingItem.quantity += guestItem.quantity;
                } else {
                    userCart.products.push(guestItem);
                }
            });

            // Recalculate total price
            userCart.totalPrice = userCart.products.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            await userCart.save();
            
            // delete guest cart after merging
            await guestCart.deleteOne();

            return res.status(200).json({ 
                msg: 'Guest cart successfully merged with user cart',
                cart: userCart
            });
        } else {
            // No existing user cart — transfer guest cart
            guestCart.user = req.user._id;
            guestCart.guestId = undefined;
            await guestCart.save();

            return res.status(200).json({ 
                msg: 'Guest cart successfully transferred to user account',
                cart: guestCart
            });
        }

    } catch (error) {
        console.error('💥 mergeCart error:', {
            message: error.message,
            stack: error.stack,
            context: { guestId, userId: req.user?._id }
        });

        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
};

