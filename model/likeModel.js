const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const likeSchema = new Schema({
    member_id: {
        type: ObjectId,
        required: "User required"
    },

    liked_at: {
        type: Date,
        default: Date.now
    }
});


const likeModel = {
    likeSchema
}

module.exports = likeModel;