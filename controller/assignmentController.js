/**
 * Assignment controller and routes
 */

const express = require("express");
const router = express.Router();

// model and functions
const { assignmentModel } = require("../model/assignmentModel");
const notificationModel = require("../model/notificationModel");

// error handler modules
const { MongoError } = require("mongodb");
const { Error } = require("mongoose");
const { validationResult } = require("express-validator");

/**
 * GET /assignment/group?groupId= &userId=
 */
router.get(
    "/group",
    //validate("userId"),
    async (req, res) => {
        const { groupId, userId } = req.query;
        try {
            console.time("GET all assignments by grpid");
            const result = await assignmentModel.getAsgByGrpId(groupId, userId);
            res.status(200).send(result);
        } catch (err) {
            // if (err == "NOT_FOUND")
            //     res.status(404).send({ error: "Group ID not found", code: err });
            // else
            if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({
                    error: err.message,
                    code: "DATABASE_ERROR",
                });
            else
                res.status(500).send({
                    error: "Error getting assignments by grpid",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("GET all assignments by grpid");
        }
    }
);

/**
 * GET /assignment/progress?userId=..
 */
router.get(
    "/progress",
    //validate("userId"),
    async (req, res) => {
        const { userId } = req.query;
        try {
            console.time("GET progress by userid");
            const result = await assignmentModel.getUndoneAssignmentByUserId(
                userId
            );
            res.status(200).send(result);
        } catch (err) {
            // if (err == "NOT_FOUND")
            //     res.status(404).send({ error: "Group ID not found", code: err });
            // else
            if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({
                    error: err.message,
                    code: "DATABASE_ERROR",
                });
            else
                res.status(500).send({
                    error: "Error getting assignment by userid",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("GET progress by userid");
        }
    }
);

/**
 * GET /assignment/user?userId  get asg by user id
 */
router.get(
    "/user",
    //validate("userId"),
    async (req, res) => {
        const { userId } = req.query;
        try {
            console.time("GET assignments by userid");
            const result = await assignmentModel.getAsgByUserId(userId);
            res.status(200).send(result);
        } catch (err) {
            // if (err == "NOT_FOUND")
            //     res.status(404).send({ error: "Group ID not found", code: err });
            // else
            if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({
                    error: err.message,
                    code: "DATABASE_ERROR",
                });
            else
                res.status(500).send({
                    error: "Error getting assignments by userid",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("GET assignments by userid");
        }
    }
);

/**
 * GET /assignment/outstanding?groupId=
 */
router.get("/outstanding", async (req, res) => {
    const { groupId } = req.query;
    try {
        console.time("GET assignment progress by grpid");
        const result = await assignmentModel.getAllAsgProgressByGrpId(groupId);
        res.status(200).send(result);
    } catch (err) {
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting members by grpid",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("GET assignment progress by grpid");
    }
});

/**
 * GET /assignment/:assignmentId  get asg by id
 */
router.get(
    "/:assignmentId",
    //validate("quizId"),
    async (req, res) => {
        const { assignmentId } = req.params;
        try {
            console.time("GET assignment by id");
            const result = await assignmentModel.getAsgById(assignmentId);

            res.status(200).send(result);
        } catch (err) {
            // if (err == "NOT_FOUND")
            //     res.status(404).send({ error: "Group ID not found", code: err });
            // else
            if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({
                    error: err.message,
                    code: "DATABASE_ERROR",
                });
            else
                res.status(500).send({
                    error: "Error getting grp by id",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("GET assignment by id");
        }
    }
);

/**
 * POST /assignment
 */
router.post(
    "/",
    //validate("createTopic"),
    async (req, res) => {
        const {
            title,
            level_id,
            topic_id,
            skill_id,
            assigned_by,
            group_id,
            deadline,
        } = req.body;
        try {
            console.time("POST assignment");
            const result = await assignmentModel.createAsgbyGrpId(
                title,
                level_id,
                topic_id,
                skill_id,
                assigned_by,
                group_id,
                deadline
            );

            // Handling for notifications
            const { _id } = result;
            if (_id) {
                console.time("POST notification by asgId");
                // Create notification when there is a new homework
                await notificationModel.createNewAssignmentNotification(
                    result,
                    "You have been assigned new homework! Start doing them here now!"
                );

                await notificationModel.createAssignmentReminderNotification(
                    result
                );

                await notificationModel.createAssignmentMarkingNotification(
                    result,
                    false
                );
            }

            res.status(200).send({ new_id: result._id });
        } catch (err) {
            if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({
                    error: err.message,
                    code: "DATABASE_ERROR",
                });
            else
                res.status(500).send({
                    error: "Error adding assignment and its notifications by grp id",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("POST assignment");
        }
    }
);

module.exports = router;
