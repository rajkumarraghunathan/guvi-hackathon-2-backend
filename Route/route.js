const express = require('express');
const Razorpay = require('razorpay');
const product = require('../Schema/schema');
const { isADmin, isNormalUser } = require('./auth');


const router = express.Router();

const razorpay = new Razorpay({
    key_id: 'your_razorpay_key_id',
    key_secret: 'your_razorpay_key_secret',
});

//Add Products
router.post('/addProduct', isADmin, async (req, res) => {
    try {
        const { productId, productImage, productName, productPrice } = req.body
        let newProduct = new product({ productId, productImage, productName, productPrice });
        await newProduct.save().then(data => {
            res.status(201).send({ message: 'A new product has been added successfully.', data: data });
        }).catch(error => {

            res.status(400).send({ message: "Product was already exists", error: error });
        })
    } catch (error) {

        res.status(500).send({ message: 'Internal Server Error' });
    }
})

//Read Products
router.get('/product', async (req, res) => {
    try {
        await product.find().then(data => {
            res.status(201).send({
                message: "Products have been retrieved successfully.",
                data: data
            })
        }).catch(error => {
            res.status(400).send({ message: "Error while getting a new product", error: error });
        })
    }

    catch (error) {
        res.status(500).send({ message: 'Error while getting a data', error: error })
    }
})

//Read Products By Id
router.get('/readProduct/:productId', isADmin, async (req, res) => {
    try {
        const { productId } = req.params;

        await product.findById({ _id: productId }).then(data => {
            if (!data) {
                return res.status(404).send({ message: 'No product found with the given ID' })
            }
            res.status(201).send({
                message: "Product have been retrieved successfully by ID.",
                data: data
            })
        }).catch(error => {

            res.status(400).send({ message: "Error while getting a  product", error: error })
        })

    } catch (error) {

        res.status(500).send({
            message: 'Error while getting a data',
            error: error
        })
    }
})

//Deleting a Product

router.delete('/deleteProduct/:productId', isADmin, async (req, res) => {
    try {
        const { productId } = req.params;
        await product.findByIdAndDelete({ _id: productId }).then(data => {
            if (!data) {
                return res.status(404).send({ message: 'No product found with the given ID' })
            }
            res.status(201).send({
                message: "Product has been deleted successfully.",
                data: data
            })
        }).catch(error => {

            res.status(400).send({ message: "Error while deleting a  product", error: error })
        })
    } catch (error) {

        res.status(500).send({
            message: 'Error while getting a data',
            error: error
        })
    }
})

//Edit a Product
router.put('/editProduct/:productId', isADmin, (req, res) => {
    try {
        const { productId } = req.params;
        product.updateOne({ productId: productId }, { $set: req.body }).then(data => {
            res.status(201).send({
                message: "Product has been update successfully.",
                data: data
            })
        }).catch(error => {

            res.status(400).send({ message: "Error while updating a product", error: error })
        })
    } catch (error) {

        res.status(500).send({
            message: 'Error while updating a data',
            error: error
        })
    }
})

//get Product
router.get('/getProduct', async (req, res) => {
    try {
        const { productName } = req.body;

        const existingProduct = await product.find({ productName });

        if (existingProduct) {
            res.send({
                message: "Products have been retrieved successfully.",
                data: existingProduct
            });
        } else {
            res.send({ message: 'No Product found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error while getting data', error: error }); // Correct the error message
    }
});


router.delete('/deleteProduct', isADmin, async (req, res) => {
    try {
        const { productName } = req.body;

        const existingProduct = await product.findOneAndDelete({ productName });

        if (existingProduct) {
            res.send({
                message: "Products have been deleted successfully.",
                data: existingProduct
            });
        } else {
            res.send({ message: 'No Product found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error while getting data', error: error }); // Correct the error message
    }
});

app.post('/create-order', isNormalUser, async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const options = {
            amount: amount * 100, // Amount in paise or smallest currency unit
            currency,
        };

        const order = await razorpay.orders.create(options);

        res.json({ order });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
});




module.exports = router;