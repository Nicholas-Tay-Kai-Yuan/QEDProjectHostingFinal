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

// For deleting the file uploaded
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

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

const lmModel = require("../model/instructionalModel");

// Upload file and image functions
const uploadDocument = (file, rssType) => {
    const filePath = `${__dirname}/../uploads/${file.filename}`;
    return new Promise((resolve, reject) => {
        return cloudinary.v2.uploader.upload(
            filePath,
            {
                resource_type: rssType,
                public_id: file.filename,
                overwrite: true,
            },
            async (err, { url }) => {
                await unlinkAsync(filePath);
                // console.log("FileURL : " + url)
                if (err) return reject(err);
                else return resolve(url);
            }
        );
    });
}

router.get("/", async (req, res) => {
    try {
        console.time("GET instructional materials");
        const result = await lmModel.getLearningMaterials();

        res.status(200).json(result);
    } catch (err) {
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting instructional materials",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("GET instructional materials");
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        console.time("GET instructional materials by userId");
        const result = await lmModel.getLearningMaterialsById(id);

        res.status(200).json(result);
    } catch (err) {
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting instructional material",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("GET instructional materials by userId");
    }
});

router.get("/user", async (req, res) => {
    const { userId } = req.query;
    try {
        console.time("GET instructional materials by userId");
        const result = await lmModel.getLearningMaterialsByOwner(userId);

        res.status(200).json(result);
    } catch (err) {
        if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error getting instructional materials",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("GET instructional materials by userId");
    }
});

router.post(
    "/",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    async (req, res) => {
        const bodyData = req.body;
        try {
            console.time("POST instructional material");
            const image = req.files.image[0];
            const imageFilePath = `${__dirname}/../uploads/${image.filename}`;
            const file = req.files.file[0];
            const fileFilePath = `${__dirname}/../uploads/${file.filename}`;
            let result;
            cloudinary.v2.uploader.upload(
                imageFilePath,
                {
                    resource_type: "image",
                    public_id: image.filename,
                    overwrite: true,
                },
                async (err, res) => {
                    const imageUrl = res.url;
                    await unlinkAsync(imageFilePath);
                    console.log("IMAGE UPLOADED!");
                    if (err) throw err;
                    else {
                        cloudinary.v2.uploader.upload(
                            fileFilePath,
                            {
                                resource_type: "raw",
                                public_id: file.filename,
                                overwrite: true,
                            },
                            async (err2, { url }) => {
                                await unlinkAsync(fileFilePath);
                                if (err2) throw err2;
                                console.log("FILE UPLOADED");
                                const data = {
                                    ...bodyData,
                                    imageUrl: imageUrl,
                                    fileUrl: url,
                                };
                                result = await lmModel.createLearningMaterials(
                                    data
                                );
                            }
                        );
                    }
                }
            );
            return res.status(200).send({});
        } catch (err) {
            if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({
                    error: err.message,
                    code: "DATABASE_ERROR",
                });
            else
                res.status(500).send({
                    error: "Error creating instructional material",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("POST instructional material");
        }
    }
);

router.delete("/", async (req, res) => {
    const { lmId } = req.query;
    try {
        console.time("DELETE instructional material by id");
        const result = await lmModel.deleteLearningMaterials(lmId);

        res.status(200).send({
            message: "Instructional material Deleted",
            lmId: result._id,
        });
    } catch (err) {
        if (err == "NOT_FOUND")
            res.status(404).send({
                error: "Learning Material ID not found",
                code: err,
            });
        else if (err instanceof Error || err instanceof MongoError)
            res.status(500).send({
                error: err.message,
                code: "DATABASE_ERROR",
            });
        else
            res.status(500).send({
                error: "Error deleting Learning Material",
                code: "UNEXPECTED_ERROR",
            });
    } finally {
        console.timeEnd("DELETE instructional material by id");
    }
});

router.put(
    "/",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    async (req, res) => {
        const { lmId } = req.query;
        const bodyData = req.body;
        console.log(req.files);

        try {
            console.time("PUT Learning Materials");
            let result = {};
            let data = bodyData;

            if (req.files) {
                const image = req.files.image ? req.files.image[0] : undefined;
                const file = req.files.file ? req.files.file[0] : undefined;
                let imageUrl = "";
                let fileUrl = "";

                if (image) {
                    imageUrl = await uploadDocument(image, "image")
                    if (!imageUrl || imageUrl instanceof Error)
                        throw "IMAGE UPLOAD FAILED";
                    data = { ...data, imageUrl: imageUrl };
                }

                if (file) {
                    fileUrl = await uploadDocument(file, "raw")
                    if (!fileUrl || fileUrl instanceof Error)
                        throw "FILE UPLOAD FAILED";

                    data = { ...data, fileUrl: fileUrl };
                }
            }

            result = await lmModel.updateLearningMaterials(lmId, data);

            return res.status(200).send({
                message: "Learning Material updated",
            });
        } catch (err) {
            console.log(err);
            if (err == "NOT_FOUND")
                res.status(404).send({
                    error: "Skill ID not found",
                    code: err,
                });
            else if (err instanceof Error || err instanceof MongoError)
                res.status(500).send({
                    error: err.message,
                    code: "DATABASE_ERROR",
                });
            else
                res.status(500).send({
                    error: "Error updating skill by id",
                    code: "UNEXPECTED_ERROR",
                });
        } finally {
            console.timeEnd("PUT Learning Materials");
        }
    }
);

module.exports = router;
