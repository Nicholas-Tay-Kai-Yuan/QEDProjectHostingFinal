/**
 * Group controller and routes
 */

const express = require("express");
const router = express.Router();
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

// For deleting the file uploaded
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

// model and functions
const { groupModel } = require("../model/groupModel");

// validation
//const { validate } = require("../validation/levelValidation");

// error handler modules
const { MongoError } = require("mongodb");
const { Error } = require("mongoose");

/**
 * GET /group/user?userId=
 */
router.get(
    "/user",
    //validate("userId"),
    async (req, res) => {
        const { userId } = req.query;
        try {
            console.time("GET group by userid");
            const result = await groupModel.getGroupsByUser(userId);
            res.status(200).send(result);
        } catch (err) {
            // if (err == "NOT_FOUND")
            //     res.status(404).send({ error: "User ID not found", code: err });
            // else
            if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({
                    error: err.message,
                    code: "DATABASE_ERROR",
                });
            else
                res.status(500).send({
                    error: "Error getting group by user id",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("GET group by userid");
        }
    }
);

/**
 * GET /group/members?groupId=
 */
router.get(
    "/members",
    //validate("userId"),
    async (req, res) => {
        const { groupId } = req.query;
        try {
            console.time("GET all members by grpid");
            const result = await groupModel.getMemberByGrpId(groupId);
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
                    error: "Error getting members by grpid",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("GET all members by grpid");
        }
    }
);

/**
 * GET /group/members?groupId= &userId=
 */
router.get("/isGrpAdmin", async (req, res) => {
    const { groupId, userId } = req.query;
    try {
        console.time("GET check if user is group admin");
        const grpRole = await groupModel.checkIfGrpAdmin(groupId, userId);
        res.status(200).send({ group_role: grpRole });
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
                error: "Error checking if user is group admin",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("GET check if user is group admin");
    }
});

/**
 * GET /group/:groupId - get grp by id
 */
router.get(
    "/:groupId",
    //validate("quizId"),
    async (req, res) => {
        const { groupId } = req.params;
        try {
            console.time("GET group by id");
            const result = await groupModel.getGroupById(groupId);

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
            console.timeEnd("GET group by id");
        }
    }
);

/**
 * POST /group
 */
router.post(
    "/",
    //validate("createLevel"),
    async (req, res) => {
        const { group_name, owner, members } = req.body;
        try {
            console.time("POST group");
            const result = await groupModel.createGroup(
                group_name,
                owner,
                members
            );

            res.status(201).send({ new_id: result._id });
        } catch (err) {
            if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({
                    error: err.message,
                    code: "DATABASE_ERROR",
                });
            else
                res.status(500).send({
                    error: "Error adding group",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("POST group");
        }
    }
);

router.put("/pfp/:groupId", upload.single("image"), async (req, res) => {
    const { groupId } = req.params;
    console.log("IMAGE UPLOADING")
    try {
        console.time("PUT new group PFP");
        const file = req.file;
        const filePath = `${__dirname}/../uploads/${file.filename}`;
        let result;
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
                    result = await groupModel.updateGroupPfp(groupId, url);
                }
            }
        );
        return res.status(200).send({ message: "Group Updated" });
    } catch (err) {
        console.log("error"+ err);
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: err.message,
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("PUT new group PFP");
    }
});

/**
 * POST /group/addMember?groupId=..&userId=..
 */
router.post(
    "/addMember",
    //validate("benchmark"),
    async (req, res) => {
        const { groupId, userId } = req.query;

        try {
            console.time("POST addMember");
            const result = await groupModel.addMember(groupId, userId);
            res.status(200).send({ message: "Member Added" });
        } catch (err) {
            console.log(err);
            if (err == "USER_EXISTS")
                res.status(422).send({
                    error: "User already exists in group",
                    code: err,
                });
            else if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({
                    error: err.message,
                    code: "DATABASE_ERROR",
                });
            else
                res.status(500).send({
                    error: "Error adding member to grp",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("POST addMember");
        }
    }
);

/**
 * PUT /group?groupId=.. (update group name)
 */
router.put(
    "/",
    //validate("benchmark"),
    async (req, res) => {
        const { groupId } = req.query;
        const { group_name } = req.body;
        try {
            console.time("PUT update group name");
            const result = await groupModel.updateGroupName(
                groupId,
                group_name
            );
            res.status(200).send({ message: "Group Name Updated" });
        } catch (err) {
            if (err == "NOT_FOUND")
                res.status(404).send({
                    error: "Group ID not found",
                    code: err,
                });
            else if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({
                    error: err.message,
                    code: "DATABASE_ERROR",
                });
            else
                res.status(500).send({
                    error: "Error updating group name",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("PUT update group name");
        }
    }
);
/**
 * DELETE /group/removeMember?groupId=..&userId=..
 */
router.delete(
    "/removeMember",
    //validate("benchmark"),
    async (req, res) => {
        const { groupId, userId } = req.query;
        //
        try {
            console.time("DELETE removeMember");
            const result = await groupModel.removeMember(groupId, userId);
            res.status(200).send({ message: "Member Deleted" });
        } catch (err) {
            // if (err == "NOT_FOUND")
            //     res.status(404).send({ error: "User ID not found", code: err });
            // else
            if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({
                    error: err.message,
                    code: "DATABASE_ERROR",
                });
            else
                res.status(500).send({
                    error: "Error removing member to grp",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("DELETE removeMember");
        }
    }
);

/**
 * PUT /group/makeAdmin?groupId=..&userId=.. update admin to true
 */
router.put(
    "/makeAdmin",
    //validate("updateTopic"),
    async (req, res) => {
        const { groupId, userId } = req.query;
        try {
            console.time("PUT make admin by user id");
            const result = await groupModel.makeGroupAdmin(groupId, userId);

            res.status(200).send({ message: "Group Updated" });
        } catch (err) {
            if (err == "NOT_FOUND")
                res.status(404).send({
                    error: "User or Group ID not found in group",
                    code: err,
                });
            else if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({
                    error: err.message,
                    code: "DATABASE_ERROR",
                });
            else
                res.status(500).send({
                    error: "Error updating group admin",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("PUT make admin by user id");
        }
    }
);

/**
 * PUT /group/dismissAdmin?groupId=..&userId=..  update admin to false
 */
router.put(
    "/dismissAdmin",
    //validate("updateTopic"),
    async (req, res) => {
        const { groupId, userId } = req.query;
        try {
            console.time("PUT dismiss admin by user id");
            const result = await groupModel.dismissGroupAdmin(groupId, userId);

            res.status(200).send({ message: "Group Updated" });
        } catch (err) {
            // if (err == "NOT_FOUND")
            //     res.status(404).send({ error: "Topic ID not found", code: err });
            // else
            if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({
                    error: err.message,
                    code: "DATABASE_ERROR",
                });
            else
                res.status(500).send({
                    error: "Error updating group admin",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("PUT dismiss admin by user id");
        }
    }
);

/**
 * POST /group/benchmark?groupId=..
 */
router.post("/benchmark", async (req, res) => {
    const { groupId } = req.query;
    try {
        console.time("POST group benchmark");
        const result = await groupModel.viewGroupBenchmark(groupId);

        res.status(200).send(result);
    } catch (err) {
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting group benchmark",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("POST group benchmark");
    }
});

/**
 * POST /group/benchmarkByUser?groupId=..
 */
router.post("/benchmarkByUser", async (req, res) => {
    const { groupId, user, level, topic } = req.query;
    try {
        console.time("POST group benchmark by user");
        const result = await groupModel.viewBenchmarkByUser(
            groupId,
            user,
            level,
            topic
        );

        res.status(200).send(result);
    } catch (err) {
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting group benchmark by user",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("POST group benchmark by user");
    }
});

/**
 * POST /group/benchmarkFilter?groupId=..
 */
router.post("/benchmarkFilter", async (req, res) => {
    const { groupId, user } = req.query;
    try {
        console.time("POST group benchmark filter");
        const result = await groupModel.getBenchmarkFilter(groupId, user);

        res.status(200).send(result);
    } catch (err) {
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting group benchmark filter",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("POST group benchmark filter");
    }
});

/**
 * POST /group/leaderboard?groupId=..
 */
router.post("/leaderboard", async (req, res) => {
    const { groupId, sort } = req.query;
    try {
        console.time("POST group leaderboard");
        const result = await groupModel.viewGroupLeaderboard(
            groupId,
            parseInt(sort)
        );

        res.status(200).send(result);
    } catch (err) {
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting group leaderboard",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("POST group leaderboard");
    }
});

/**
 * DELETE /group/:groupId - delete quiz by id
 */
// router.delete(
//     "/:groupId",
//     //validate("quizId"),
//     async (req, res) => {
//         const { groupId, userId } = req.query;
//         try {
//             console.time("PUT dismiss admin by user id");
//             const result = await groupModel.dismissGroupAdmin(groupId, userId);

//             res.status(200).send({ message: "Group Updated" });
//         } catch (err) {
//             // if (err == "NOT_FOUND")
//             //     res.status(404).send({ error: "Topic ID not found", code: err });
//             // else
//             if (err instanceof Error || err instanceof MongoError)
//                 res.status(500).send({
//                     error: err.message,
//                     code: "DATABASE_ERROR",
//                 });
//             else
//                 res.status(500).send({
//                     error: "Error updating group admin",
//                     code: "UNEXPECTED_ERROR",
//                 });
//         } finally {
//             console.timeEnd("PUT dismiss admin by user id");
//         }
//     }
// );

/**
 * DELETE /group/:groupId - delete grp by id
 */
router.delete(
    "/:groupId",
    //validate("quizId"),
    async (req, res) => {
        const { groupId } = req.params;
        try {
            console.time("DELETE grp by id");
            const result = await groupModel.deleteGroupById(groupId);
            
            res.status(200).send({ message: "Group Deleted" });
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
                    error: "Error deleting grp",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("DELETE grp by id");
        }
    }
);

module.exports = router;
