const mongoose = require('mongoose')

const password = process.argv[2]

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('person', personSchema)

const url = `mongodb+srv://urwah1248:${password}@cluster0.s3hy5oa.mongodb.net/phonebook?retryWrites=true&w=majority`

if(process.argv.length < 3){
    console.log('Give password as argument')
    console.log('If you want to add a person, give a name and number as well')
}

else if(process.argv.length === 5){

    mongoose
        .connect(url)
        .then(() => {
            console.log('connected')

            const person = new Person({
                name: process.argv[3],
                number: process.argv[4]
            })

            return person.save()
        })
        .then(() => {
            console.log(`Added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
}

else if(process.argv.length === 3){
    mongoose.connect(url)

    Person.find({}).then(result => {

        console.log('Phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}