const mongoose = require('mongoose');

require('dotenv').config();

const dbConnect= ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log('Connection with Db Successful');
    })
    .catch((err)=>{
        console.log('Connection ERROR');
        console.error(err);
        process.exit(1);
    })

};
module.exports = dbConnect;