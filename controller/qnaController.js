/**
 * QnA controller and routes
 */

const express = require("express");
const router = express.Router();

// model and functions
const { groupModel } = require("../model/groupModel");
const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + "/../uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    },
});

const upload = multer({ storage: storage });
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

// error handler modules
const { MongoError } = require("mongodb");
const { Error } = require("mongoose");

/**
 * POST /qna/group/:groupId - Create questions by group id
 */

router.post("/group/:groupId", upload.single("image"), async (req, res) => {
    const { groupId } = req.params;
    const { title, content, made_by, answers } = req.body;
    const file = req.file;
    try {
        console.time("POST question");
        if (file) {
            const filePath = `${__dirname}/../uploads/${file.filename}`;
            cloudinary.v2.uploader.upload(
                filePath,
                {
                    resource_type: "image",
                    public_id: file.filename,
                    overwrite: true,
                },
                async (err, { url }) => {
                    await unlinkAsync(filePath);
                    if (err) {
                        console.log(err);
                        throw err;
                    } else {
                        result = await groupModel.createQuestionByGrpId(
                            groupId,
                            {
                                title: title,
                                content: content,
                                made_by: made_by,
                                answers: answers,
                                image: url,
                            }
                        );
                        return res.status(200).send({ new_id: result._id });
                    }
                }
            );
        } else {
            result = await groupModel.createQuestionByGrpId(groupId, {
                title,
                content,
                made_by,
                answers,
            });
            return res.status(200).send({ new_id: result._id });
        }
    } catch (err) {
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error creating question by grp id",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("POST question");
    }
});

/**
 * GET /qna/:questionId - Get questions by question id
 */
router.get(
    "/:questionId",
    //validate("topicId"),
    async (req, res) => {
        const { questionId } = req.params;
        try {
            console.time("GET question by id");
            const result = await groupModel.getQuestionByQnId(questionId);

            res.status(200).json(result);
        } catch (err) {
            if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({
                    error: err.message,
                    code: "DATABASE_ERROR",
                });
            else
                res.status(500).send({
                    error: "Error getting question by id",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            // timing the function
            console.timeEnd("GET question by id");
        }
    }
);

/**
 * GET /qna/group/:groupId - Get questions by group id
 */
router.get("/group/:groupId", async (req, res) => {
    const { groupId } = req.params;
    try {
        console.time("GET question by id");
        const result = await groupModel.getQuestionByGroupId(groupId);

        res.status(200).json(result);
    } catch (err) {
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting question by id",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        // timing the function
        console.timeEnd("GET question by id");
    }
});

/**
 * POST /qna/question/:questionId/answer - add new answer
 */
router.post("/question/:questionId/answer", async (req, res) => {
    const { questionId } = req.params;
    const { content, made_by } = req.body;
    try {
        console.time("POST answer by question id");
        const result = await groupModel.createAnswerByQnId(questionId, {
            content,
            made_by,
        });

        res.status(200).send({ new_id: result._id });
    } catch (err) {
        if (err == "NOT_FOUND")
            res.status(404).send({ error: "Question ID not found", code: err });
        else if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error creating answer by Question id",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("POST answer by question id");
    }
});

/**
 * POST /qna/question/answer/:answerId/like - like an answer
 */

router.post("/question/answer/:answerId/like", async (req, res) => {
    const { answerId } = req.params;
    const { member_id, question_id } = req.body;
    try {
        console.time("POST like by answer id");
        const result = await groupModel.likeByAnswerId(answerId, {
            member_id,
            question_id,
        });

        res.status(200).send({ new_id: result._id });
    } catch (err) {
        if (err == "NOT_FOUND")
            res.status(404).send({ error: "answer ID not found", code: err });
        else if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error creating like by answer id",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("POST like by answer id");
    }
});

/**
 * DELETE /qna/question/answer/:answerId/like - unlike an answer
 */

router.delete("/question/answer/:answerId/unlike", async (req, res) => {
    const { answerId } = req.params;
    const { member_id, question_id } = req.body;
    try {
        console.time("DELETE like by answer id");
        const result = await groupModel.unlikeByAnswerId(answerId, {
            member_id,
            question_id,
        });

        res.status(200).send({ new_id: result._id });
    } catch (err) {
        if (err == "NOT_FOUND")
            res.status(404).send({ error: "answer ID not found", code: err });
        else if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error creating like by answer id",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("POST like by answer id");
    }
});

module.exports = router;
