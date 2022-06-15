const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const helmet = require('helmet'); //
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean'); // this secure for html attract
const hpp = require('hpp'); // Stands for parameter pollution
const app = express();
const globalErrorHandler = require('./controllers/errorController')
console.log(process.env.NODE_ENV)

// 1) GLOBAL MIDDLEWIRE

// SET SECURITY HTTP HEADERS
app.use(helmet())
// DEVELOPMENT LOGGIN
if(process.env.NODE_ENV==="development"){
    app.use(morgan('dev'));
}
// LIMIT REQUEST FROM SAME API
const limiter = rateLimit({
    max:100,
    windowMs:60*60*1000, //100 request per hour in milisecond
    message:'Too many request from this ip, Please try again in an hour'
})
app.use('/api',limiter);
// BODY PARSER , READING DATA FROM BODY INTO REQ.BODY
app.use(express.json({limit:'10kb'}));
// Data sanitization against no sequel query injection
app.use(mongoSanitize());
// Data sanitization against XSS 
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist:[
        'duration',
        'ratingsAverage',
        'ratingsQuantity',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));
// Serving static files
app.use(express.static(`${__dirname}/public`))
// Test middlewire 
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();  
    console.log(req.headers)
    next()
})
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.all('*',(req,res,next)=>{
    next(new AppError(`Can't not found ${req.originalUrl} on this server`, 404))
});
app.use(globalErrorHandler)
module.exports = app;