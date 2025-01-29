const mongoose = require('mongoose')

const exerciseschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    days:{
        type:Array,
        required:true,
    },
    weeks:{
        type:Array,
        required:true,
    },
    superset:{
        type:Boolean,
        required:true,
        default:false,
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Video',
        required:true,
    },
    // users: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         required: true,
    //         ref: "User"
    //     }
    // ],
    // users: {
    //     type:Array,
    //     required:true,
    // },
    exercisetype:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    // repetitions:{
    //     type:Array,
    //     required:true,
    // }

},{timestamps:true})

exerciseschema.pre(/^find/, function(next){
    this.find({}).select('-__v -createdAt -updatedAt').populate('video')
    next();
});

const Exercise = mongoose.model('Exercise', exerciseschema)


module.exports = Exercise