const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const LearningMaterialSchema = new Schema({
    subject: {
        type: String,
        required: "Subject required",
    },
    level_id: {
        type: ObjectId,
        required: "Level Id required",
    },
    topic_id: {
        type: ObjectId,
        required: "Topic Id required",
    },
    skill_id: {
        type: ObjectId,
        required: "Skill Id required",
    },
    description: {
        type: String,
        required: "Description required",
    },
    imageUrl: {
        type: String,
    },
    fileUrl: {
        type: String,
        require: "File URL for learning materials required",
    },
    owner: {
        type: ObjectId,
        required: "Owner required",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const LearningMaterial = mongoose.model(
    "LearningMaterial",
    LearningMaterialSchema
);

const LearningMaterialModel = {
    LearningMaterialSchema,
    getLearningMaterials: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await LearningMaterial.aggregate([
                    { $sort: { date_created: -1 } },
                ]);
                if (!result) throw "NO_DATA";
                console.log("SUCCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(`ERROR! Could not get learning materials`);
                reject(err);
            }
        });
    },
    getLearningMaterialsByOwner: (ownerId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await LearningMaterial.aggregate([
                    {
                        $match: {
                            owner: ObjectId(ownerId),
                        },
                    },
                ]);
                if (!result) throw "NO_DATA";
                console.log("SUCCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not get learning materials by owner : ${ownerId}`
                );
                reject(err);
            }
        });
    },
    getLearningMaterialsById: (lmId) => {
        return new Promise(async(resolve, reject) => {
            try{
                const result = await LearningMaterial.findOne(ObjectId(lmId))
                if (!result) throw "NO_DATA";
                console.log("SUCCESS! Result", result);
                resolve(result);
            }catch(err){
                console.error(
                    `ERROR! Could not get learning materials by lmId : ${lmId}`
                );
                reject(err);
            }
        })
    },
    createLearningMaterials: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const newLM = new LearningMaterial(data);
                const result = await newLM.save();

                if (!result) throw "UNEXPECTED_ERROR";

                console.log("SUCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error("ERROR! Could not add learning materials", err);
                reject(err);
            }
        });
    },
    deleteLearningMaterials: (lmId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await LearningMaterial.findByIdAndDelete(
                    ObjectId(lmId)
                );

                if (!result) throw "NOT_FOUND";

                console.log("Result: ", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not delete learning materials with id ${lmId}`
                );
                reject(err);
            }
        });
    },
    updateLearningMaterials: (lmId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await LearningMaterial.findByIdAndUpdate(ObjectId(lmId), data);
                if (!result) throw "NOT_FOUND";

                console.log("SUCCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Failed to update learning materials with id : ${lmId}`,
                    err
                );
                reject(err);
            }
        });
    },
};

module.exports = LearningMaterialModel;
