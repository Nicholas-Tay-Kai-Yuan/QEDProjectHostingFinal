const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;
const { answerSchema } = require("./answerModel");

const qnaSchema = new Schema({
    title: {
        type: String,
        required: "Title required",
    },
    content: {
        type: String,
        required: "Content required",
    },
    // any educator with admin rights can post? admin
    made_by: {
        type: ObjectId,
        required: "QnA Post owner is required",
    },
    answers: [answerSchema],
    image: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const qnaModel = {
    qnaSchema,
};

module.exports = qnaModel;
