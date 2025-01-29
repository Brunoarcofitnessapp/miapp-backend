const mongoose = require('mongoose')

const ingredientsschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    unit: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    }
})

const Ingredient = mongoose.model('Ingredient', ingredientsschema)

module.exports = Ingredient