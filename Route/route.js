const express = require('express');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
const product = require('../Schema/schema');
const { isADmin, isNormalUser, isAuth } = require('./auth');
const User = require('../Schema/userSchema')


const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
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
        res.status(500).send({ message: 'Error while getting data', error: error });
    }
});

// Create a route for payement and send a receipt to mail
router.post('/create-order', isAuth, async (req, res) => {
    try {
        const { amount, currency } = req.body;
        console.log(amount);

        const options = {
            amount: amount * 100,
            currency,
        };

        const order = await razorpay.orders.create(options);
        const existingUser = await User.find({ email: req.user.email })
        console.log(existingUser);

        // const transporter = nodemailer.createTransport({

        //     service: 'gmail',
        //     auth: {
        //         user: process.env.user,
        //         pass: process.env.pass
        //     }
        // });

        // const mailOptions = {
        //     from: process.env.user,
        //     to: user.email,
        //     subject: 'Password Reset',
        //     text: `Your Order :${order}`,
        // };

        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.log('Error sending email:', error);
        //         return false;
        //     } else {
        //         console.log('Email sent:', info.response);
        //         return true;
        //     }
        // });

        res.send({ order });
    } catch (error) {
        res.status(500).send({ error: 'Failed to create order' });
    }
});


// Create a route to handle the payment webhook
router.post('/payment-webhook', async (req, res) => {
    const { event, payload } = req.body;

    try {
        // Verify the webhook event using the Razorpay Webhook signature
        const isValidSignature = razorpay.webhook.validate(
            event,
            payload,
            process.env.YOUR_WEBHOOK_SECRET
        );

        if (isValidSignature) {
            // Process the payment and update your database or perform other business logic

            res.status(200).send('Webhook received successfully');
        } else {
            res.status(400).send('Invalid signature');
        }
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).send('Error processing webhook');
    }
});



module.exports = router;