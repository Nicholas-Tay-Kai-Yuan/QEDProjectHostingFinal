/**
 * Level controller and routes
 */

const express = require("express");
const router = express.Router();

// model and functions
const levelModel = require("../model/levelModel");

// validation
const { validate } = require("../validation/levelValidation");

// authentiication
const { isAuth, isAdmin } = require("../auth/authorization");

// error handler modules
const { MongoError } = require("mongodb");
const { Error } = require("mongoose");

/**
 * GET /level
 */
router.get("/",
    async (_req, res) => {
        try {
            console.time("GET all levels");
            const result = await levelModel.getAllLevels();
            res.status(200).json(result);
        } catch (err) {
            if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({ error: err.message, code: "DATABASE_ERROR" });
            else
                res.status(500).send({ error: "Error getting all levels", code: "UNEXPECTED_ERROR" });
        } finally {
            // timing the function
            console.timeEnd("GET all levels");
        }
    });


/**
 * GET /level/:levelId
 */
router.get("/:levelId",
    validate("levelId"),
    async (req, res) => {
        const { levelId } = req.params;
        try {
            console.time("GET level by id");
            const result = await levelModel.getLevelById(levelId);

            res.status(200).json(result);
        } catch (err) {
            if (err == "NOT_FOUND")
                res.status(404).send({ error: "Level ID not found", code: err });
            else if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({ error: err.message, code: "DATABASE_ERROR" });
            else
                res.status(500).send({ error: "Error getting level by id", code: "UNEXPECTED_ERROR" });
        } finally {
            console.timeEnd("GET level by id");
        }
    });


/**
 * POST /level
 */
router.post("/",
    validate("createLevel"),
    isAuth,
    isAdmin,
    async (req, res) => {
        const { level, topics } = req.body;
        try {
            console.time("POST level");
            const result = await levelModel.createLevel(level, topics, { "unique": true });

            res.status(201).send({ new_id: result._id });
        } catch (err) {
            if (err == "LEVEL_EXISTS")
                res.status(422).send({ error: "Level already exists, try updating existing level instead", code: err });
            else if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({ error: err.message, code: "DATABASE_ERROR" });
            else
                res.status(500).send({ error: "Error adding level", code: "UNEXPECTED_ERROR" });
        } finally {
            console.timeEnd("POST level");
        }
    });


/**
 * PUT /level/:levelId - update existing level information by id
 */
router.put("/:levelId",
    validate("updateLevel"),
    isAuth,
    isAdmin,
    async (req, res) => {
        const { levelId } = req.params;
        const changedFields = { ...req.body };
        try {
            console.time("PUT level by id");
            const result = await levelModel.updateLevelById(levelId, changedFields);

            res.status(200).send({ message: "Level Updated" });
        } catch (err) {
            if (err == "NOT_FOUND")
                res.status(404).send({ error: "Level ID not found", code: err });
            else if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({ error: err.message, code: "DATABASE_ERROR" });
            else
                res.status(500).send({ error: "Error updating level", code: "UNEXPECTED_ERROR" });
        } finally {
            console.timeEnd("PUT level by id");
        }
    });


/**
* DELETE /level/:levelId - delete level by id
*/
router.delete("/:levelId",
    validate("levelId"),
    isAuth,
    isAdmin,
    async (req, res) => {
        const { levelId } = req.params;
        try {
            console.time("DELETE level by id");
            const result = await levelModel.deleteLevelById(levelId);

            res.status(200).send({ message: "Level Deleted" });
        } catch (err) {
            if (err == "NOT_FOUND")
                res.status(404).send({ error: "Level ID not found", code: err });
            else if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({ error: err.message, code: "DATABASE_ERROR" });
            else
                res.status(500).send({ error: "Error deleting level", code: "UNEXPECTED_ERROR" });
        } finally {
            console.timeEnd("DELETE level by id");
        }
    });


/**
* POST /level/resetDefault - delete all level and create the default ones
*/
router.post("/resetDefault",
    isAuth,
    isAdmin,
    async (_req, res) => {
        try {
            console.time("POST reset default levels");

            const result = await levelModel.resetDefault();
            res.status(200).send({ message: "Default Levels Resetted" });
        } catch (err) {
            if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({ error: err.message, code: "DATABASE_ERROR" });
            else
                res.status(500).send({ error: "Error reseting to default level", code: "UNEXPECTED_ERROR" });
        } finally {
            console.timeEnd("POST reset default levels");
        }
    });


module.exports = router;