import Product from '../models/product.model.js';
import { Types } from 'mongoose';
import { customError } from '../utils/custom.error.js';

const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, products });
    } catch (error) {
        return next(error);
    }
};

const getProductById = async (req, res,next) => {
    const { id } = req.params;
    try {
        if (!Types.ObjectId.isValid(id)) {
            return next(customError(400, "Invalid product ID"));
        }
        const product = await Product.findById(id);
        if (!product) {
            return next(customError(404, 'Product not found'));
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        return next(error);
    }
};

const createProduct = async (req, res,next) => {
    const { name, price } = req.body;
    try {
        const newProduct = new Product({ name, price, userId: req.user.id });
        await newProduct.save();
        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        return next(error);
    }
};

const updateProduct = async (req, res,next) => {
    const { id } = req.params;
    try {
        if (!Types.ObjectId.isValid(id)) {
            return next(customError(400, "Invalid product ID"));
        }
        //check if product exist or not
        const product = await Product.findById(id);
        if (!product) {
            return next(customError(404, 'Product not found'));
        }
        //check if user is authorized to update the product
        if (product.userId.toString() !== req.user.id) {
            return next(customError(403, 'Not Authorized'));
        }
        //update the product
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
        return next(error);
    }
};

const deleteProduct = async (req, res,next) => {
    const { id } = req.params;
    try {
        if (!Types.ObjectId.isValid(id)) {
            return next(customError(400, "Invalid product ID"));
        }
        //check if product exist or not
        const product = await Product.findById(id);
        if (!product) {
            return next(customError(404, 'Product not found'));
        }
        //check if user is authorized to update the product
        if (product.userId.toString() !== req.user.id) {
            return next(customError(403, 'Not Authorized'));
        }
        //delete the product
        await Product.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, message: 'Product Deleted Successfully' });
    } catch (error) {
        return next(error);

    }
};

export {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
