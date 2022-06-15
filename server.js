const mongoose = require('mongoose')
const dotenv= require('dotenv');
dotenv.config({path:'./config.env'});
process.on('uncaughtException',err=>{
    console.log(err.name, err.message)
    console.log('UNHANDLED EXCEPTION 🎇SHUTTING DOWN...');
        process.exit(1);
})
const app = require('./app');
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
)
// const DBLOCAL = process.env.DATABASE_LOCAL.replace(
//     '<PASSWORD>',
//     process.env.DATABASE_PASSWORD
// )
mongoose
    .connect(DB,{
        useNewUrlParser:true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true,
    }).then(()=>console.log('Database connection successfull!'));


const port = 3000 || process.env.PORT;
const server = app.listen(port,()=>{
    console.log('app running on port :',port);
})

// Handle unhandled rejection
   
process.on('unhandledRejection',err=>{
    console.log('UNHANDLED REJECTION 🎇SHUTTING DOWN...');
    console.log(err.name, err.message);
    server.close(()=>{
        process.exit(1);
    })
})
