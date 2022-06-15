const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A tour must have a name!'],
        unique:true,
        trim:true,
        maxlength:[40,'A tour name must have less or equal than 40 character'],
        minlength:[10,'A tour name must have more or equal than 10 character'],
        // validate:[validator.isAlpha,'Tour name must only contain characters']
    },
    slug:String,
    duration:{
        type:Number,
        required:[true,'A tour must have a duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have a group size']
    },
    difficulty:{
        type:String,
        required:[true,'A tour must have a difficulty'],
        enum:{
            values:['easy','midium','difficult'],
            message:'Difficulty is either : easy, midium, difficult'
        }
    },

    ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1,'A rating must be above 1'],
        max:[5,'A rating must be below 5']
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },

    price:{
        type:Number,
        required:[true,'A tour must have a price']
    },
    priceDiscount:{
        type:Number,
        validate:{
            validator:function(val){
                // THIS ONLY POINTS TO THE CURRENT DOC ON NEW DOCUMENT CREATION
                return val <this.price;
            },
            message:'Discound price ({VALUE}) should be below the regular price'
        }
        
    },
        
    summary:{
        type:String,
        trim:true,
        required:[true,'A tour must have a summary']
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,'A tour must have a image']
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select:true //THIS PROPERTY SET TO FALSE, HIDE THIS FROM THE CLIENT
    },
    startDates:[Date],
    secretTour:{
        type:Boolean,
        default:false
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7
})
//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true})
    next();
});

// tourSchema.pre('save',function(next){
//     console.log('will save document...')
//     next();
// })

// tourSchema.post('save',function(doc,next){
//     console.log(doc);
//     next();
// })
//QUERY MIDDLEWIRE


// tourSchema.pre('find',function(next){
tourSchema.pre(/^find/,function(next){
    this.find({secretTour:{$ne:true}});
    this.start = Date.now()
    next();
})
tourSchema.post(/find/,function(docs,next){
    console.log(`Query took ${Date.now()-this.start} millisecond !`)
    next()
})
//AGGREGATION MIDDLEWIRE
tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match:{secretTour:{$ne:true}}})
    console.log(this.pipeline())
    next()
})
const Tour = mongoose.model('Tour',tourSchema);
module.exports = Tour;