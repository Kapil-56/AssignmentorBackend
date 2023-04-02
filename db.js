const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://kapil56:DNgSIDzpLrzkEhG6@assignment.kgpw5g4.mongodb.net/?retryWrites=true&w=majority"

const connectToMongo = () => {
  mongoose.set('strictQuery', false)
  mongoose.connect(
    mongoURI
  )
    .then(() => console.log('connected to  the database'))
    .catch(e => console.log(e));

}


module.exports = connectToMongo; 