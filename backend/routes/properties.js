const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// Create a new property
router.post('/add', async (req, res) => {
    const property = new Property(req.body);
    try {
        await property.save();
        res.status(201).send(property);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get properties with pagination
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;
    try {
        const properties = await Property.find({})
            .limit(limit)
            .skip(skipIndex)
            .exec();
        const totalCount = await Property.countDocuments();
        res.status(200).json({
            properties,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit)
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a property
router.patch('/update/:id', async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(property);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a property
router.delete('/delete/:id', async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        res.status(200).send(property);
    } catch (error) {
        res.status(500).send(error);
    }
});
// Like a property
router.patch('/like/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        property.likes++;
        await property.save();
        res.status(200).send(property);
    } catch (error) {
        res.status(400).send(error);
    }
});
const nodemailer = require('nodemailer');

// Handle buyer interest
router.post('/interest/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        const { buyerName, buyerEmail } = req.body;
        
        // Send email to seller with buyer details
        const transporter = nodemailer.createTransport({
            // Setup your email transporter (e.g., SMTP, Gmail, etc.)
        });
        const sellerEmail = 'seller@example.com'; // Update with actual seller email
        await transporter.sendMail({
            from: 'your-email@example.com',
            to: sellerEmail,
            subject: 'Interest in Your Property',
            text: `Dear Seller,\n\n${buyerName} (${buyerEmail}) is interested in your property.\n\nRegards,\nReal Estate Website`
        });

        // Send email to buyer with contact details
        await transporter.sendMail({
            from: 'your-email@example.com',
            to: buyerEmail,
            subject: 'Contact Details for Property',
            text: `Dear Buyer,\n\nContact Details: ${property.contactDetails}\n\nRegards,\nReal Estate Website`
        });

        res.status(200).send('Interest registered successfully');
    } catch (error) {
        res.status(400).send(error);
    }
});



module.exports = router;
