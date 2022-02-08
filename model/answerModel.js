const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;
const { likeSchema } = require("./likeModel");

const answerSchema = new Schema({
    content: {
        type: String,
        required: "Content required"
    },
    // any educator with admin rights can post? admin
    made_by: {
        type: ObjectId,
        required: "Answer Post owner is required"
    },
    likes: [likeSchema],

    created_at: {
        type: Date,
        default: Date.now
    }
});


const answerModel = {
    answerSchema
}

module.exports = answerModel;