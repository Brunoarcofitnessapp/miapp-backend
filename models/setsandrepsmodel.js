const mongoose = require('mongoose');

const setsandrepsschema = new mongoose.Schema({
    repetitions:{
        type:Array,
        required:true,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    ],
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
    },
    exercise:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Exercise'
    }
})

setsandrepsschema.pre(/^find/, function (next){
    this.find({}).populate({ path:"exercise", select:"-users -days -weeks"}).populate({ path:"users", select:"firstname lastname _id"}).sort({ "exercise.superset": 1 })
    next()
})

const SetsandReps = mongoose.model('SetsandReps',setsandrepsschema)

module.exports = SetsandReps