const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    place: { type: String, required: true },
    area: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    nearbyHospitals: { type: String, required: true },
    nearbyColleges: { type: String, required: true },
    description: { type: String },
    contactDetails: { type: String, required: true },
    likes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Property', PropertySchema);
