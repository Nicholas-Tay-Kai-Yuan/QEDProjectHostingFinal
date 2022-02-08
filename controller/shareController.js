const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary");
require("dotenv").config();
const { MongoError } = require("mongodb");
const { Error } = require("mongoose");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/*
    POST /share
*/
router.post("/", async(req, res) => {
        console.log("SHARE IMAGE UPLOADING")
        const { dataUrl } = req.body
        try {
            console.time("POST new user share post image");
            cloudinary.v2.uploader.upload(
                dataUrl,
                {
                    resource_type: "image",
                    public_id: `${Date.now()}_share_img.png`,
                    overwrite: true,
                },
                async (err, { url }) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    } else {
                        return res
                            .status(200)
                            .send({ url: url });
                    }
                }
            );
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
            console.timeEnd("POST new user share post image");
        }
    }
)

module.exports = router