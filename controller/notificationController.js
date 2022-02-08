/**
 * Notification controller and routes
 */

const express = require("express");
const router = express.Router();

// model and functions
const notificationModel = require("../model/notificationModel");

// error handler modules
const { MongoError } = require("mongodb");
const { Error } = require("mongoose");

/**
 * GET /notification/user?userId=
 */
router.get("/user", async (req, res) => {
    const { userId } = req.query;
    try {
        console.time("GET noti by userid");
        const result = await notificationModel.getNotificationByUser(userId);
        res.status(200).send(result);
    } catch (err) {
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting notification by user id",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("GET noti by userid");
    }
});

/**
 * PUT /notification/dismiss dismiss notification by id
 */
router.put("/dismiss", async (req, res) => {
    const { notificationId } = req.query;
    try {
        console.time("PUT dismiss noti by userid");
        await notificationModel.dismissNotificationById(notificationId);
        res.status(200).send({ message: "Notification Dismissed" });
    } catch (err) {
        console.log(err);
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error dismissing noti",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("PUT dismiss noti by userid");
    }
});

/**
 * DELETE /notification/:notificationId - delete notification by id
 */
 router.delete(
    "/:notificationId",
    //validate("quizId"),
    async (req, res) => {
        const { notificationId } = req.params;
        try {
            console.time("DELETE notification by id");
            const result = await notificationModel.deleteNotification(notificationId);
            
            res.status(200).send({ message: "Notification Deleted" });
        } catch (err) {
            console.log(err);
            // if (err == "NOT_FOUND")
            //     res.status(404).send({ error: "Quiz ID not found", code: err });
            // else
            if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({
                    error: err.message,
                    code: "DATABASE_ERROR",
                });
            else
                res.status(500).send({
                    error: "Error deleting notification",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("DELETE notification by id");
        }
    }
);

router.get("/",
    async (_req, res) => {
        try {
            console.time("GET all notifications");
            const result = await notificationModel.getAllNotifications();
            res.status(200).json(result);
        } catch (err) {
            if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({ error: err.message, code: "DATABASE_ERROR" });
            else
                res.status(500).send({ error: "Error getting all notifications", code: "UNEXPECTED_ERROR" });
        } finally {
            // timing the function
            console.timeEnd("GET all notifications");
        }
    });

module.exports = router;
