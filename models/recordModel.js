const mongoose = require('mongoose');


const recordschema = new mongoose.Schema({
    weekone:{
        type:Boolean,
        default:false
    },
    weektwo:{
        type:Boolean,
        default:false
    },
    weekthree:{
        type:Boolean,
        default:false
    },
    weekfour:{
        type:Boolean,
        default:false
    },
    records:{
        type:Array,
        default:[]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    exercise:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Exercise',
        required:true
    }
    
},{timestamps:true})

recordschema.pre(/^find/, function(next){
    this.find({}).select('-__v -createdAt -updatedAt').populate({path:'user',select:"email _id lastame"}).populate({path:"exercise",select:"name _id exercisetype superset"})
    next();
});

const Record = mongoose.model('Record', recordschema)

module.exports = Record