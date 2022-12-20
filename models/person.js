require('dotenv').config()
const mongoose = require('mongoose')
// const uniqueValidator = require('mongoose-unique-validator')

// mongoose.set('useFindAndModify', false)
// mongoose.set('useCreateIndex', true)

const url = process.env.MONGODB_URL

console.log('Connecting to', url)

mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })


const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    number: {
        type: String,
        minlength: 8,
        // validate: {
        //     validator: function(v) {
        //         return /\d{3}-\d{3}-\d{4}/.test(v)
        //     },
        //     message: props => `${props.value} is not a valid phone number!`
        // },
        required: true
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// personSchema.plugin(uniqueValidator)

const Person = mongoose.model('person', personSchema)

module.exports = Person