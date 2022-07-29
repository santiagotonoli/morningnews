var mongoose = require('mongoose')

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology: true,
    useNewUrlParser: true
}

mongoose.connect('mongodb+srv://dev:dev@cluster0.pr7be.mongodb.net/morningnews?retryWrites=true&w=majority',
    options,
    function(err) {
        if (err) { console.log(err); }
        else { console.log("Connected to the database morningnews!"); }
      }
)
module.exports = mongoose