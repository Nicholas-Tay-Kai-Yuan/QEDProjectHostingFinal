/**
 * Quiz controller and routes
 */

const express = require("express");
const router = express.Router();

// model and functions
const quizModel = require("../model/quizModel");

// validation
const { validate } = require("../validation/quizValidation");

// error handler modules
const { MongoError } = require("mongodb");
const { Error } = require("mongoose");
const notificationModel = require("../model/notificationModel");
const { assignmentModel } = require("../model/assignmentModel");
const { groupModel } = require("../model/groupModel");
const _ = require("lodash");

/**
 * GET /quiz - get all quizzes
 */
router.get("/", async (_req, res) => {
    try {
        console.time("GET all quizzes");
        const result = await quizModel.getAllQuizzes();

        res.status(200).json(result);
    } catch (err) {
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting all quizzes",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        // timing the function
        console.timeEnd("GET all quizzes");
    }
});

/**
 * GET /quiz/user?userId=
 */
router.get("/user", validate("userId"), async (req, res) => {
    const { userId } = req.query;
    try {
        console.time("GET quiz by user id");
        const result = await quizModel.getQuizByUserId(userId);
        res.status(200).send(result);
    } catch (err) {
        if (err == "NOT_FOUND")
            res.status(404).send({ error: "User ID not found", code: err });
        else if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting quiz by user id",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("GET quiz by user id");
    }
});

router.get("/filter", validate("benchmark"), async (req, res) => {
    const { user } = req.query;
    try {
        console.time("GET filter");
        const result = await quizModel.getQuizByFilter(user);
        res.status(200).send(result);
    } catch (err) {
        if (err == "NOT_FOUND")
            res.status(404).send({ error: "None found", code: err });
        else if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting filter",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("GET filter");
    }
});
/**
 * GET /quiz/recommendation?userId
 * used after student completes quiz
 */
router.get("/recommendation", validate("userId"), async (req, res) => {
    const { userId } = req.query;
    try {
        console.time("GET recommend quiz");
        const result = await quizModel.recommendQuiz(userId);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        if (err == "NOT_FOUND")
            res.status(404).send({ error: "User ID not found", code: err });
        else if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting recommendation",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("GET recommend quiz");
    }
});
/**
 * GET /quiz/popular
 */
router.get("/popular", async (req, res) => {
    try {
        console.time("GET popular quiz");
        const result = await quizModel.popularQuiz();
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting popular quiz",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("GET popular quiz");
    }
});

/**
 * GET /quiz/recommendation?userId
 * used for emails and to show progress
 */
router.get("/progress", validate("userId"), async (req, res) => {
    const { userId } = req.query;
    try {
        console.time("POST weekly progress");
        const result = await quizModel.getWeeklyProgress(userId);
        res.status(200).send(result);
    } catch (err) {
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting benchmark",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("POST weekly progress");
    }
});

/**
 * GET /quiz/:quizId - get quiz by id
 */
router.get("/:quizId", validate("quizId"), async (req, res) => {
    const { quizId } = req.params;
    try {
        console.time("GET quiz by id");
        const result = await quizModel.getQuizById(quizId);
        res.status(200).send(result);
    } catch (err) {
        if (err == "NOT_FOUND")
            res.status(404).send({ error: "Quiz ID not found", code: err });
        else if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting quiz by id",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("GET quiz by id");
    }
});

/**
 * POST /quiz
 */
router.post("/", validate("createQuiz"), async (req, res) => {
    try {
        console.time("POST quiz");
        // Get leaderboard first so that later on can check if top 3 places has any difference (only require if there is a group)
        const { assignment_id } = req.body;
        let oldLeaderboard, group_id;
        if (assignment_id) {
            group_id = (await assignmentModel.getAsgById(assignment_id))
                .group_id;
            oldLeaderboard = [
                await groupModel.viewGroupLeaderboardTop(group_id, 1),
                await groupModel.viewGroupLeaderboardTop(group_id, 2),
                await groupModel.viewGroupLeaderboardTop(group_id, 3),
            ];
        }

        const result = await quizModel.createQuiz(req.body);

        // When there is a new quiz being added, check if changes to leaderboard to push notifications if needed
        if (assignment_id && result) {
            // If there is assignment, check if need to create notifications for assignment
            const assignment = await assignmentModel.getAsgById(assignment_id)
            await notificationModel.createAssignmentMarkingNotification(
                assignment,
                true
            ); // Specify true to mention that it is checking for all students complete before deadline

            const newLeaderboard = [
                await groupModel.viewGroupLeaderboardTop(group_id, 1),
                await groupModel.viewGroupLeaderboardTop(group_id, 2),
                await groupModel.viewGroupLeaderboardTop(group_id, 3),
            ];

            // If leaderboard changes, push notifications
            for (let j = 0; j < 3; j++) {
                if (
                    Object.keys(newLeaderboard[j].leaderboard).length !==
                        Object.keys(oldLeaderboard[j].leaderboard).length ||
                    Object.keys(newLeaderboard[j].leaderboard).every(
                        (p) =>
                            newLeaderboard[j].leaderboard[p] !==
                            oldLeaderboard[j].leaderboard[p]
                    )
                ) {
                    await notificationModel.createLeaderboardChangesNotification(
                        assignment_id
                    );
                    break;
                }
            }
        }

        res.status(201).send({ new_id: result._id });
    } catch (err) {
        console.log(err);
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error creating quiz",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("POST quiz");
    }
});

/**
 * PUT /quiz/:quizId - update existing quiz by id
 */
router.put("/:quizId", validate("updateQuiz"), async (req, res) => {
    const { quizId } = req.params;
    const changedFields = { ...req.body };
    try {
        console.time("PUT quiz by id");
        const result = await quizModel.updateQuizById(quizId, changedFields);

        res.status(200).send({ message: "Quiz Updated" });
    } catch (err) {
        if (err == "NOT_FOUND")
            res.status(404).send({ error: "Quiz ID not found", code: err });
        else if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error updating quiz",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("PUT quiz by id");
    }
});

/**
 * DELETE /quiz/:quizId - delete quiz by id
 */
router.delete("/:quizId", validate("quizId"), async (req, res) => {
    const { quizId } = req.params;
    try {
        console.time("DELETE quiz by id");
        const result = await quizModel.deleteQuizById(quizId);

        res.status(200).send({ message: "Quiz Deleted" });
    } catch (err) {
        console.log(err);
        if (err == "NOT_FOUND")
            res.status(404).send({ error: "Quiz ID not found", code: err });
        else if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error deleting quiz",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("DELETE quiz by id");
    }
});

/**
 * POST /quiz/leaderboard?scope=grade
 */
router.post("/leaderboard", validate("scope"), async (req, res) => {
    const { scope, sort, filter } = req.query;
    const { user } = req.headers;
    try {
        const sortType = parseInt(sort);
        const filterType = parseInt(filter);
        console.time("POST leaderboard");
        if (scope == "" || scope == undefined) {
            const result = await quizModel.getGlobalLeaderboard(
                JSON.parse(user),
                sortType,
                filterType
            );
            res.status(200).send(result);
        } else {
            const result = await quizModel.getGlobalLeaderboard(
                JSON.parse(user),
                sortType,
                filterType,
                scope
            );
            res.status(200).send(result);
        }
        // do get leaderboard by group id
    } catch (err) {
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting leaderboard",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("POST leaderboard");
    }
});

router.post("/benchmarkComparison", validate("benchmark"), async (req, res) => {
    const { user, level, topic } = req.query;
    try {
        console.time("POST compare benchmark");
        const result = await quizModel.getBenchmarkComparison(
            user,
            level,
            topic
        );
        res.status(200).send(result);
    } catch (err) {
        if (err == "NOT_FOUND")
            res.status(404).send({ error: "User ID not found", code: err });
        else if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else console.log(err);
        res.status(500).send({
            error: "Error getting compare benchmark",
            code: "UNEXPECTED_ERROR",
        });
    } finally {
        console.timeEnd("POST compare benchmark");
    }
});

/**
 * POST /quiz/benchmark
 * used after student completes quiz
 */
router.post("/benchmark", validate("benchmark"), async (req, res) => {
    const { user, level, topic, skill } = req.query;
    try {
        console.time("POST benchmark");
        const result = await quizModel.getGlobalBenchmark(
            user,
            level,
            topic,
            skill
        );
        res.status(200).send(result);
    } catch (err) {
        if (err == "NOT_FOUND")
            res.status(404).send({ error: "User ID not found", code: err });
        else if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting benchmark",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("POST benchmark");
    }
});

/**
 * POST /quiz/benchmark/top?user=
 */
router.post("/benchmark/top", async (req, res) => {
    const { user } = req.query;
    try {
        console.time("POST benchmark");
        const result = await quizModel.getTopBenchmarkByUser(user);
        res.status(200).send(result);
    } catch (err) {
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting benchmark",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("POST benchmark");
    }
});

/**
 * POST /quiz/populate
 */
router.post("/populate", async (req, res) => {
    try {
        console.time("POST populate quiz");
        const result = await quizModel.populateQuizzes();
        res.status(201).send({ message: "Quiz Populated" });
    } catch (err) {
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error populating quiz",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("POST populate quiz");
    }
});

module.exports = router;
