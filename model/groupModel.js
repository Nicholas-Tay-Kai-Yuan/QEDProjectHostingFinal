const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;
const { QuizSchema } = require("./quizModel");
const { PostSchema } = require("./postModel");
const { qnaSchema } = require("./qnaModel");
const { resetDefault } = require("./levelModel");
const { assign } = require("nodemailer/lib/shared");

// creating group object schema
const GroupSchema = new Schema({
    group_name: {
        type: String,
        required: "Group Name required",
    },
    owner: {
        type: ObjectId,
        required: "Owner required",
    },
    members: {
        type: [
            {
                _id: false,
                user_id: {
                    type: ObjectId,
                    required: "User ID required",
                },
                is_admin: {
                    type: Boolean,
                    default: false,
                    required: "Admin tag required",
                },
            },
        ],
    },
    pfp: {
        type: String,
    },
    posts: [PostSchema],
    qna: [qnaSchema],
});

const Group = mongoose.model("Group", GroupSchema);
const Quiz = mongoose.model("Quiz", QuizSchema);

const groupModel = {
    GroupSchema,
    // get all groups of a user by user id DONE
    getGroupsByUser: (user_id) => {
        return new Promise(async (resolve, reject) => {
            try {
                // const result = await Group.find({ "members.user_id": ObjectId(user_id) }).select('-__v');
                const result = await Group.aggregate([
                    {
                        $match: {
                            $or: [
                                { "members.user_id": ObjectId(user_id) },
                                { owner: ObjectId(user_id) },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            posts: { $last: "$posts" }, // get only the latest post
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "posts.made_by",
                            foreignField: "_id", //<field from users collection>
                            as: "user", //<output array field>
                        },
                    },
                    {
                        $addFields: {
                            //get made_by name using id
                            "posts.sender_name": {
                                $map: {
                                    input: "$user",
                                    as: "sender_name",
                                    in: {
                                        $concat: [
                                            "$$sender_name.first_name",
                                            " ",
                                            "$$sender_name.last_name",
                                        ],
                                    },
                                },
                            },
                            "posts.pfp": "$user.pfp",
                        },
                    },
                    {
                        $addFields: {
                            "posts.sender_name": {
                                $last: "$posts.sender_name",
                            }, // chg sender_name from array to objF
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id", //<field from users collection>
                            as: "owner_name", //<output array field>
                        },
                    },
                    {
                        $addFields: {
                            owner_name: { $last: "$owner_name" }, // chg owner_name from array to obj
                        },
                    },
                    {
                        $addFields: {
                            owner_name: {
                                $concat: [
                                    "$owner_name.first_name",
                                    " ",
                                    "$owner_name.last_name",
                                ],
                            },
                            owner_pfp: "$owner_name.pfp",
                        },
                    },
                    {
                        $project: {
                            user: 0,
                        },
                    },
                ]);

                if (!result) throw "NOT_FOUND";

                console.log("SUCCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error("ERROR! Could not get groups by userid:", err);
                reject(err);
            }
        });
    },

    // get all member by grp id DONE
    getMemberByGrpId: (groupId) => {
        return new Promise(async (resolve, reject) => {
            try {
                // const result = await Group.find({ "_id": groupId }).select('owner members.user_id');
                const result = await Group.aggregate([
                    {
                        $match: {
                            _id: ObjectId(groupId),
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            as: "user",
                            foreignField: "_id",
                            localField: "owner",
                        },
                    },
                    {
                        $project: { posts: 0 },
                    },
                    {
                        $project: {
                            owner: {
                                $first: "$user",
                            },
                            members: 1,
                        },
                    },
                    {
                        $project: {
                            "owner._id": 1,
                            "owner.first_name": 1,
                            "owner.last_name": 1,
                            "owner.role": 1,
                            "owner.pfp": 1,
                            members: 1,
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            group_name: { $first: "$group_name" },
                            members: { $first: "$members" },
                            owner: { $first: "$owner" },
                            owner_name: { $first: "$owner_name" },
                        },
                    },
                    {
                        $unwind: {
                            path: "$members",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            as: "user",
                            foreignField: "_id",
                            localField: "members.user_id",
                        },
                    },
                    {
                        $project: {
                            owner: 1,
                            "members.user_id": 1,
                            "members.is_admin": 1,
                            "members.user_name": {
                                $first: {
                                    $map: {
                                        input: "$user",
                                        as: "user",
                                        in: {
                                            $concat: [
                                                "$$user.first_name",
                                                " ",
                                                "$$user.last_name",
                                            ],
                                        },
                                    },
                                },
                            },
                            "members.role": {
                                $first: {
                                    $map: {
                                        input: "$user",
                                        as: "user",
                                        in: "$$user.role",
                                    },
                                },
                            },
                            "members.email": {
                                $first: {
                                    $map: {
                                        input: "$user",
                                        as: "user",
                                        in: "$$user.email",
                                    },
                                },
                            },
                            "members.pfp": {
                                $first: {
                                    $map: {
                                        input: "$user",
                                        as: "user",
                                        in: "$$user.pfp",
                                    },
                                },
                            },
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            members: { $push: "$members" },
                            owner: { $first: "$owner" },
                        },
                    },
                ]);
                if (!result) throw "NOT_FOUND";

                console.log("SUCCESS! Result", result);
                resolve(result[0]);
            } catch (err) {
                console.error("ERROR! Could not get members by grp:", err);
                reject(err);
            }
        });
    },

    // get specific group by group id DONE
    getGroupById: (groupId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Group.aggregate([
                    {
                        $match: { _id: ObjectId(groupId) },
                    },
                    {
                        $unwind: {
                            path: "$posts",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            as: "sender_name",
                            localField: "posts.made_by",
                            foreignField: "_id", //<field from users collection>
                        },
                    },
                    {
                        $project: {
                            //get made_by name using id
                            group_name: 1,
                            members: 1,
                            owner: 1,
                            pfp: 1,
                            "posts._id": 1,
                            "posts.content": 1,
                            "posts.made_by": 1,
                            "posts.created_at": 1,
                            "posts.sender_name": {
                                $first: {
                                    $map: {
                                        input: "$sender_name",
                                        as: "sender_name",
                                        in: {
                                            $concat: [
                                                "$$sender_name.first_name",
                                                " ",
                                                "$$sender_name.last_name",
                                            ],
                                        },
                                    },
                                },
                            },
                            "qna._id": 1,
                            "qna.title": 1,
                            "qna.content": 1,
                            "qna.made_by": 1,
                            "qna.answers": 1,
                            "qna.created_at": 1,
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            group_name: { $first: "$group_name" },
                            members: { $first: "$members" },
                            owner: { $first: "$owner" },
                            pfp: { $first: "$pfp" },
                            posts: { $push: "$posts" },
                            qna: { $first: "$qna" },
                        },
                    },
                ]);

                if (!result || result.length < 1) throw "NOT_FOUND";

                console.log("SUCCESS! Result", result);
                resolve(result[0]);
            } catch (err) {
                console.error("ERROR! Could not get grp by id:", err);
                reject(err);
            }
        });
    },

    checkIfGrpAdmin: (group_id, user_id) => {
        return new Promise(async (resolve, reject) => {
            try {
                // const admin = await Group.aggregate([
                //     {
                //         $match: {
                //             "_id": ObjectId(group_id)
                //         },
                //     },
                //     {
                //         $project: {
                //             posts: 0,
                //             __v: 0
                //         }
                //     },
                //     {
                //         $unwind: "$members"
                //     },
                //     {
                //         $match: {
                //             $or: [
                //                 { "members.user_id": ObjectId(user_id) },
                //                 { "owner": ObjectId(user_id) }
                //             ]
                //         }
                //     }
                // ]);
                const admin = await Group.findOne({
                    _id: ObjectId(group_id),
                    members: {
                        $elemMatch: {
                            user_id: ObjectId(user_id),
                            is_admin: true,
                        },
                    },
                }).select("-posts -__v");

                let owner = null;
                if (!admin) {
                    owner = await Group.findOne({
                        _id: ObjectId(group_id),
                        owner: ObjectId(user_id),
                    }).select("-posts -__v");
                }

                if (owner) {
                    resolve("owner");
                } else if (admin) {
                    resolve("admin");
                } else {
                    resolve(false);
                }
            } catch (err) {
                console.error(
                    `ERROR! Could not check if user ${user_id} is a group admin in ${group_id}: ${err}`
                );
                reject(err);
            }
        });
    },

    // create group with members  DONE
    createGroup: (group_name, owner, members) => {
        return new Promise(async (resolve, reject) => {
            try {
                const newGame = new Group({
                    group_name,
                    owner: ObjectId(owner),
                    members,
                });
                const result = await newGame.save();

                if (!result) throw "UNEXPECTED_ERROR";

                console.log("SUCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error("ERROR! Could not create group", err);
                reject(err);
            }
        });
    },

    updateGroupPfp: (group_id, URL) => {
        return new Promise(async (resolve, reject) => {
            try {
                const group = await Group.findOne({ _id: ObjectId(group_id) });
                if (!group) throw "NOT FOUND";

                group.pfp = URL;
                const result = await group.save();

                if (!result) throw "UNEXPECTED_ERROR";

                console.log("SUCCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error("ERROR! Could not create group", err);
                reject(err);
            }
        });
    },

    // update group
    updateGroupName: (groupId, group_name) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Group.findByIdAndUpdate(
                    ObjectId(groupId),
                    { group_name: group_name }
                );

                if (!result) throw "NOT_FOUND";

                console.log("Result: ", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not update group by ID ${groupId}`,
                    err
                );
                reject(err);
            }
        });
    },

    // add new member(existing user) by user id to existing grp  DONE
    addMember: (groupId, user_id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const group = await Group.findOne({ _id: ObjectId(groupId) });
                if (!group) throw "NOT_FOUND";

                // find if members exist in the grp
                const found = group.members.find(
                    (element) => element.user_id == user_id
                );
                if (found) throw "USER_EXISTS";

                // append user to db array and save to db
                group.members.push({ user_id });

                const result = await group.save();

                if (!result) throw "UNEXPECTED_ERROR";

                console.log("SUCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not update group with id ${groupId}: ${err}`
                );
                reject(err);
            }
        });
    },
    // remove member member(existing user) by user id from a grp DONE
    removeMember: (groupId, user_id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const group = await Group.findOne({
                    _id: ObjectId(groupId),
                    "members.user_id": ObjectId(user_id),
                });
                if (!group) throw "NOT_FOUND";

                // find index of the user in the array that matches the id
                const foundIndex = group.members.findIndex(
                    (element) => element.user_id == user_id
                );
                if (isNaN(foundIndex) && !foundIndex) throw "NOT_FOUND";

                // delete member from members array
                group.members.pull(group.members[foundIndex]);
                // save changes
                const result = await group.save();

                console.log("SUCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not delete group with id ${groupId}: ${err}`
                );
                reject(err);
            }
        });
    },
    // make a member an admin by user id   DONE
    makeGroupAdmin: (groupId, user_id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const group = await Group.findOne({ _id: ObjectId(groupId) });
                if (!group) throw "NOT_FOUND";

                // find if members exist in the grp
                const found = group.members.find(
                    (element) => element.user_id == user_id
                );
                if (!found) throw "NOT_FOUND";

                // find if member is an admin
                const isAdmin = found.is_admin;
                if (isAdmin) throw "UNEXPECTED_ERROR";

                found.is_admin = !found.is_admin;
                const result = await group.save();

                console.log("SUCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not update group with id ${groupId}: ${err}`
                );
                reject(err);
            }
        });
    },
    // remove admin right of a user  DONE
    dismissGroupAdmin: (groupId, user_id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const group = await Group.findOne({ _id: ObjectId(groupId) });
                if (!group) throw "NOT_FOUND";

                // find if members exist in the grp
                const found = group.members.find(
                    (element) => element.user_id == user_id
                );
                if (!found) throw "NOT_FOUND";

                // find if member is an admin
                const isAdmin = found.is_admin;

                if (isAdmin == false) throw "UNEXPECTED_ERROR";

                found.is_admin = !found.is_admin;
                const result = group.save();

                console.log("SUCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not update group with id ${groupId}: ${err}`
                );
                reject(err);
            }
        });
    },

    // get benchmark
    viewGroupBenchmark: (groupId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const group = await Group.aggregate([
                    {
                        $match: { _id: ObjectId(groupId) },
                    },
                    {
                        $unwind: "$members",
                    },
                    {
                        $project: {
                            user_id: "$members.user_id",
                            group_name: 1,
                        },
                    },
                    {
                        $lookup: {
                            from: "quizzes",
                            as: "quiz",
                            localField: "user_id",
                            foreignField: "done_by",
                        },
                    },
                    {
                        $project: { "quiz.questions": 0 },
                    },
                    {
                        $unwind: "$quiz",
                    },
                    {
                        $addFields: {
                            "quiz.group_name": "$group_name",
                            "quiz.group_id": "$_id",
                        },
                    },
                    { $replaceRoot: { newRoot: "$quiz" } },
                    {
                        $group: {
                            _id: "$group_id",
                            group_name: { $first: "$group_name" },
                            easy_average_score: { $avg: "$score.easy" },
                            medium_average_score: { $avg: "$score.medium" },
                            difficult_average_score: {
                                $avg: "$score.difficult",
                            },
                            average_score: { $avg: "$score.total" },
                            average_time_taken: { $avg: "$time_taken" },
                        },
                    },
                ]);

                const global = await Quiz.aggregate([
                    {
                        $group: {
                            _id: null,
                            easy_average_score: { $avg: "$score.easy" },
                            medium_average_score: { $avg: "$score.medium" },
                            difficult_average_score: {
                                $avg: "$score.difficult",
                            },
                            total_average_score: { $avg: "$score.total" },
                            average_time_taken: { $avg: "$time_taken" },
                        },
                    },
                    { $project: { _id: 0 } },
                ]).limit(1);

                const result = {
                    group: group[0],
                    global: global[0],
                };

                // console.log("SUCCESS! Result: ", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not view group benchmark with id ${groupId}: ${err}`
                );
                reject(err);
            }
        });
    },
    viewBenchmarkByUser: (groupId, userId, level, topic) => {
        return new Promise(async (resolve, reject) => {
            try {
                let match_opt = {
                    group_id: ObjectId(groupId), //get all from group
                };

                let groupBy = "level";

                if (level != undefined && level != "") groupBy = "topic_name";
                if (topic != undefined && topic != "") groupBy = "skill_name";

                const group_data = await Group.aggregate([
                    {
                        $match: { _id: ObjectId(groupId) },
                    },
                    {
                        $unwind: "$members",
                    },
                    {
                        $project: {
                            user_id: "$members.user_id",
                            group_name: 1,
                        },
                    },
                    {
                        $lookup: {
                            from: "quizzes",
                            as: "quiz",
                            localField: "user_id",
                            foreignField: "done_by",
                        },
                    },
                    {
                        $project: { "quiz.questions": 0 },
                    },
                    {
                        $unwind: "$quiz",
                    },
                    {
                        $addFields: {
                            "quiz.group_name": "$group_name",
                            "quiz.group_id": "$_id",
                        },
                    },
                    { $replaceRoot: { newRoot: "$quiz" } },
                    {
                        $group: {
                            _id: {
                                groupid: "$group_id",
                                match: `$${groupBy}`,
                            },
                            // "group_name": { $first: "$group_name" },
                            // "easy_average_score": { $avg: "$score.easy" },
                            // "medium_average_score": { $avg: "$score.medium" },
                            // "difficult_average_score": { $avg: "$score.difficult" },
                            average_score: { $avg: "$score.total" },
                            // "average_time_taken": { $avg: "$time_taken" }
                        },
                    },
                    {
                        $group: {
                            _id: "$_id.groupid",
                            total_average_score: {
                                $push: {
                                    _id: "$_id.match",
                                    total_average_score: "$average_score",
                                },
                            },
                        },
                    },
                    {
                        $unwind: "$total_average_score",
                    },
                    {
                        $project: {
                            _id: "$total_average_score._id",
                            total_average_score:
                                "$total_average_score.total_average_score",
                        },
                    },
                ]);

                match_opt["done_by"] = ObjectId(userId);
                delete match_opt["group_id"];

                const recent_data = await Quiz.aggregate([
                    {
                        $match: match_opt,
                    },
                    {
                        $group: {
                            _id: `$${groupBy}`,
                            easy: { $push: "$score.easy" },
                            medium: { $push: "$score.medium" },
                            difficult: { $push: "$score.difficult" },
                            total: { $push: "$score.total" },
                            time: { $push: "$time_taken" },
                        },
                    },
                    {
                        $project: {
                            _id: "$_id",
                            // "easy_average_score": { $avg: { $slice: ["$easy", -10]}},
                            // "medium_average_score": { $avg: { $slice: ["$medium", -10]}},
                            // "difficult_average_score": { $avg: { $slice: ["$difficult", -10]}},
                            total_average_score: { $avg: { $slice: ["$total", -10] } },
                            // "average_time_taken": { $avg: { $slice: ["$time", -10]}}
                        },
                    },
                ]);

                const global_data = await Quiz.aggregate([
                    {
                        $group: {
                            _id: `$${groupBy}`,
                            easy: { $push: "$score.easy" },
                            medium: { $push: "$score.medium" },
                            difficult: { $push: "$score.difficult" },
                            total: { $push: "$score.total" },
                            time: { $push: "$time_taken" },
                        },
                    },
                    {
                        $project: {
                            _id: "$_id",
                            // "easy_average_score": { $avg: "$easy"},
                            // "medium_average_score": { $avg: "$medium"},
                            // "difficult_average_score": { $avg: "$difficult"},
                            total_average_score: { $avg: "$total" },
                            // "average_time_taken": { $avg: "$time"}
                        },
                    },
                ]);

                let result = {};
                for (let i = 0; i < group_data.length; i++) {
                    let name = group_data[i]._id;
                    let recent;
                    let global;

                    recent_data.forEach((data) => {
                        if (data._id == name) {
                            recent = data.total_average_score;
                            return false;
                        }
                    });
                    global_data.forEach((data) => {
                        if (data._id == name) {
                            global = data.total_average_score;
                            return false;
                        }
                    });

                    result[name] = {
                        group: group_data[i].total_average_score,
                        recent: recent,
                        global: global,
                    };
                }

                console.log("SUCCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(`ERROR! Could not get benchmark: ${err}`);
                reject(err);
            }
        });
    },
    getBenchmarkFilter: (groupId, userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let match_opt = {
                    done_by: ObjectId(userId),
                };

                const result = await Quiz.aggregate([
                    {
                        $match: match_opt,
                    },
                    {
                        // join to level to get skill name
                        $lookup: {
                            from: "levels",
                            as: "level",
                            localField: "skill_id",
                            foreignField: "topics.skills._id",
                        },
                    },
                    {
                        $match: {
                            level: { $not: { $size: 0 } },
                        },
                    },
                    {
                        $project: { level: 0 },
                    },
                    {
                        $group: {
                            _id: {
                                level: "$level",
                                topics: "$topic_name",
                            },
                            skills: {
                                $addToSet: "$skill_name",
                            },
                        },
                    },
                    {
                        $group: {
                            _id: "$_id.level",
                            topics: {
                                $addToSet: {
                                    topic: "$_id.topics",
                                    skills: "$skills",
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            _id: "$_id",
                            topics: "$topics",
                        },
                    },
                ]);
                if (!result) throw "NOT_FOUND";

                console.log("SUCCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error("ERROR! Could not get quizzes by: ", err);
                reject(err);
            }
        });
    },
    // get leaderboard
    viewGroupLeaderboard: (groupId, sort) => {
        let sortObj = {};
        let groupObj = {
            _id: "$done_by",
            group_name: { $first: "$group_name" },
        };

        if (sort === 1) {
            sortObj = { average_score: -1 };
            groupObj = { ...groupObj, average_score: { $avg: "$score.total" } };
        } else if (sort === 2) {
            sortObj = { average_time_taken: 1 };
            groupObj = {
                ...groupObj,
                average_time_taken: { $avg: "$time_taken" },
            };
        } else {
            sortObj = { num_of_quiz: -1 };
            groupObj = { ...groupObj, num_of_quiz: { $sum: 1 } };
        }

        return new Promise(async (resolve, reject) => {
            try {
                const result = await Group.aggregate([
                    {
                        $match: { _id: ObjectId(groupId) },
                    },
                    {
                        $unwind: "$members",
                    },
                    {
                        $project: {
                            user_id: "$members.user_id",
                            group_name: 1,
                        },
                    },
                    {
                        $lookup: {
                            from: "quizzes",
                            as: "quiz",
                            localField: "user_id",
                            foreignField: "done_by",
                        },
                    },
                    {
                        $unwind: "$quiz",
                    },
                    {
                        $addFields: {
                            "quiz.group_name": "$group_name",
                        },
                    },
                    { $replaceRoot: { newRoot: "$quiz" } },
                    {
                        $group: groupObj,
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "_id",
                            foreignField: "_id", //<field from the documents of the "from" collection>
                            as: "user", //<output array field>
                        },
                    },
                    {
                        $addFields: {
                            user: {
                                $first: "$user",
                            },
                        },
                    },
                    {
                        $addFields: {
                            first_name: "$user.first_name",
                            last_name: "$user.last_name",
                            school: "$user.school",
                            grade: "$user.grade",
                            pfp: "$user.pfp",
                        },
                    },
                    {
                        $project: {
                            user: 0,
                        },
                    },
                    {
                        $sort: sortObj,
                    },
                    {
                        $group: {
                            _id: "$group_name",
                            leaderboard: { $push: "$$ROOT" },
                        },
                    },
                    {
                        $project: {
                            group_name: "$_id",
                            leaderboard: 1,
                            _id: 0,
                        },
                    },
                ]);
                console.log("SUCCESS! Result: ", result);
                resolve(result[0]);
            } catch (err) {
                console.error(
                    `ERROR! Could not view group leaderboard with id ${groupId}: ${err}`
                );
                reject(err);
            }
        });
    },

    // View leaderboard top 3 only
    viewGroupLeaderboardTop: (groupId, sort) => {
        let sortObj = {};
        let groupObj = {
            _id: "$done_by",
            group_name: { $first: "$group_name" },
        };

        if (sort === 1) {
            sortObj = { average_score: -1 };
            groupObj = { ...groupObj, average_score: { $avg: "$score.total" } };
        } else if (sort === 2) {
            sortObj = { average_time_taken: 1 };
            groupObj = {
                ...groupObj,
                average_time_taken: { $avg: "$time_taken" },
            };
        } else {
            sortObj = { num_of_quiz: -1 };
            groupObj = { ...groupObj, num_of_quiz: { $sum: 1 } };
        }

        return new Promise(async (resolve, reject) => {
            try {
                const result = await Group.aggregate([
                    {
                        $match: { _id: ObjectId(groupId) },
                    },
                    {
                        $unwind: "$members",
                    },
                    {
                        $project: {
                            user_id: "$members.user_id",
                            group_name: 1,
                        },
                    },
                    {
                        $lookup: {
                            from: "quizzes",
                            as: "quiz",
                            localField: "user_id",
                            foreignField: "done_by",
                        },
                    },
                    {
                        $unwind: "$quiz",
                    },
                    {
                        $addFields: {
                            "quiz.group_name": "$group_name",
                        },
                    },
                    { $replaceRoot: { newRoot: "$quiz" } },
                    {
                        $group: groupObj,
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "_id",
                            foreignField: "_id", //<field from the documents of the "from" collection>
                            as: "user", //<output array field>
                        },
                    },
                    {
                        $addFields: {
                            user: {
                                $first: "$user",
                            },
                        },
                    },
                    {
                        $addFields: {
                            first_name: "$user.first_name",
                            last_name: "$user.last_name",
                            school: "$user.school",
                            grade: "$user.grade",
                        },
                    },
                    {
                        $project: {
                            user: 0,
                        },
                    },
                    {
                        $sort: sortObj,
                    },
                    {
                        $group: {
                            _id: "$group_name",
                            leaderboard: { $push: "$$ROOT" },
                        },
                    },
                    {
                        $project: {
                            group_name: "$_id",
                            leaderboard: 1,
                            _id: 0,
                        },
                    },
                    { $limit: 3 },
                ]);
                console.log("SUCCESS! Result: ", result);
                resolve(result[0]);
            } catch (err) {
                console.error(
                    `ERROR! Could not view group leaderboard with id ${groupId}: ${err}`
                );
                reject(err);
            }
        });
    },

    // delete by group id DONE
    deleteGroupById: (groupId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Group.findByIdAndDelete(ObjectId(groupId));

                if (!result) throw "NOT_FOUND";

                console.log("Result: ", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not delete group with id ${groupId}: ${err}`
                );
                reject(err);
            }
        });
    },

    /**
     * Post Functions
     */
    // get posts by group id  DONE
    getPostsByGrpId: (groupId) => {
        return new Promise(async (resolve, reject) => {
            try {
                // const result = await Group.find({ "_id": groupId }).select("posts");
                const result = await Group.aggregate([
                    {
                        $match: { _id: ObjectId(groupId) },
                    },
                    {
                        $unwind: "$posts",
                    },
                    {
                        $lookup: {
                            from: "users",
                            as: "sender_name",
                            localField: "posts.made_by",
                            foreignField: "_id", //<field from users collection>
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            "posts._id": 1,
                            "posts.content": 1,
                            "posts.made_by": 1,
                            "posts.created_at": 1,
                            "posts.sender_name": {
                                $first: {
                                    $map: {
                                        input: "$sender_name",
                                        as: "sender_name",
                                        in: {
                                            $concat: [
                                                "$$sender_name.first_name",
                                                " ",
                                                "$$sender_name.last_name",
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    },
                    { $replaceRoot: { newRoot: "$posts" } },
                ]);

                if (!result) throw "NOT_FOUND";

                console.log("SUCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not get post by ${groupId}: ${err}`
                );
                reject(err);
            }
        });
    },
    // get post by id  DONE
    getPostById: (postId) => {
        return new Promise(async (resolve, reject) => {
            try {
                // return postId, content, made_by
                const result = await Group.aggregate([
                    { $unwind: "$posts" },
                    { $match: { "posts._id": ObjectId(postId) } },
                    {
                        $project: {
                            _id: 0,
                            postId: "$posts._id",
                            content: "$posts.content",
                            made_by: "$posts.made_by",
                            created_at: "$posts.created_at",
                        },
                    },
                ]);

                if (!result || result.length == 0) throw "NOT_FOUND";

                console.log("SUCCESS! Result", result);
                resolve(result[0]); //result will be an array with only 1 object
            } catch (err) {
                console.error(
                    `ERROR! Could not get post with id ${postId}: ${err}`
                );
                reject(err);
            }
        });
    },
    // add post in a group  DONE
    createPostByGrpId: (groupId, post) => {
        return new Promise(async (resolve, reject) => {
            try {
                const group = await Group.findOne({ _id: groupId });
                if (!group) throw "NOT_FOUND";
                console.log("post created");
                console.log(post);
                // append new post to db array and save to db
                group.posts.push(post);
                let new_id = group.posts.slice(-1)[0]._id;
                const result = await group.save();

                if (!result) throw "UNEXPECTED_ERROR";
                console.log("SUCESS! Result", result);
                resolve(new_id);
            } catch (err) {
                console.error(
                    `ERROR! Could not add post using grp id ${groupId}, ${err}`
                );
                reject(err);
            }
        });
    },
    // update post by post id
    updatePostById: (postId, content) => {
        return new Promise(async (resolve, reject) => {
            try {
                const group = await Group.findOne({ "posts._id": postId });
                if (!group) throw "NOT_FOUND";

                // find the topic in the array that matches the id
                const found = group.posts.findIndex(
                    (element) => element._id == postId
                );

                // update changed fields to group
                group.posts[found].content = content;

                // save changes to db
                const result = await group.save();

                //if (!result) throw "UNEXPECTED_ERROR";
                console.log("SUCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not update post using id ${postId}: ${err}`
                );
                reject(err);
            }
        });
    },
    // deleting post by grp id DONE
    deletePostById: (postId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const group = await Group.findOne({ "posts._id": postId });
                if (!group) throw "NOT_FOUND";

                // find index of the post in the array that matches the id
                const foundIndex = group.posts.findIndex(
                    (element) => element._id == postId
                );
                if (isNaN(foundIndex) && !foundIndex) throw "NOT_FOUND";

                // delete post from posts array
                group.posts.pull(group.posts[foundIndex]);
                // save changes
                const result = await group.save();

                console.log("SUCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not delete post with id ${postId}: ${err}`
                );
                reject(err);
            }
        });
    },

    // add question in a group
    createQuestionByGrpId: (groupId, question) => {
        return new Promise(async (resolve, reject) => {
            try {
                const group = await Group.findOne({ _id: groupId });
                if (!group) throw "NOT_FOUND";
                // append new question to db array and save to db
                group.qna.push(question);
                let new_id = group.qna.slice(-1)[0]._id;
                const result = await group.save();

                if (!result) throw "UNEXPECTED_ERROR";
                console.log("SUCESS! Result", result);
                resolve(new_id);
            } catch (err) {
                console.error(
                    `ERROR! Could not add post using grp id ${groupId}, ${err}`
                );
                reject(err);
            }
        });
    },

    //Get question by question id
    getQuestionByQnId: (questionId) => {
        return new Promise(async (resolve, reject) => {
            try {
                // return postId, content, made_by
                const result = await Group.aggregate([
                    { $unwind: "$qna" },
                    { $match: { "qna._id": ObjectId(questionId) } },
                    {
                        $project: {
                            _id: 0,
                            qnaId: "$qna._id",
                            title: "$qna.title",
                            content: "$qna.content",
                            made_by: "$qna.made_by",
                            answers: "$qna.answers",
                            created_at: "$qna.created_at",
                            image: "$qna.image",
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "made_by",
                            foreignField: "_id", //<field from users collection>
                            as: "user", //<output array field>
                        },
                    },
                    {
                        $unwind: {
                            path: "$answers",
                            preserveNullAndEmptyArrays: true,
                        },
                    },

                    {
                        $lookup: {
                            from: "users",
                            let: { ans_made_by: "$answers.made_by" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$_id", "$$ans_made_by"],
                                        },
                                    },
                                },
                            ],
                            as: "answers.user",
                        },
                    },
                    {
                        $group: {
                            _id: "$qnaId",
                            answers: { $push: "$answers" },
                            title: { $first: "$title" },
                            content: { $first: "$content" },
                            made_by: { $first: "$made_by" },
                            created_at: { $first: "$created_at" },
                            image: { $first: "$image" },
                            user: { $first: "$user" },
                        },
                    },
                ]);

                if (!result || result.length == 0) throw "NOT_FOUND";

                console.log("SUCCESS! Result", result);
                resolve(result[0]); //result will be an array with only 1 object
            } catch (err) {
                console.error(
                    `ERROR! Could not get answer with id ${questionId}: ${err}`
                );
                reject(err);
            }
        });
    },

    getQuestionByGroupId: (groupId) => {
        return new Promise(async (resolve, reject) => {
            try {
                // return postId, content, made_by
                const result = await Group.aggregate([
                    { $match: { _id: ObjectId(groupId) } },
                    { $unwind: "$qna" },
                    { $replaceRoot: { newRoot: "$qna" } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "made_by",
                            foreignField: "_id",
                            as: "made_by",
                        },
                    },
                    {
                        $addFields: {
                            answers: { $size: "$answers" },
                        },
                    },
                ]);

                if (!result || result.length == 0) throw "NOT_FOUND";

                console.log("SUCCESS! Result", result);
                resolve(result); //result will be an array with only 1 object
            } catch (err) {
                console.error(
                    `ERROR! Could not get questions with group_id ${groupId}: ${err}`
                );
                reject(err);
            }
        });
    },

    // add answer by question id
    createAnswerByQnId: (qnId, answer) => {
        return new Promise(async (resolve, reject) => {
            try {
                const group = await Group.findOne({ "qna._id": qnId });
                if (!group) throw "NOT_FOUND";

                // find the topic in the array that matches the id
                const found = group.qna.find((element) => element._id == qnId);
                // append new skill to db array and save to db
                found.answers.push(answer);
                const result = group.save();

                console.log("SUCCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not create skill with topic id ${qnId}: ${err}`
                );
                reject(err);
            }
        });
    },

    // like by answer id
    likeByAnswerId: (answerId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const group = await Group.findOne({
                    "qna.answers._id": answerId,
                });
                const qna = group.qna.find(
                    (element) => element._id == data.question_id
                );
                if (!group) throw "NOT_FOUND";

                // find the topic in the array that matches the id
                const found = qna.answers.find(
                    (element) => element._id == answerId
                );
                // append new skill to db array and save to db
                found.likes.push({ member_id: data.member_id });
                const result = group.save();

                console.log("SUCCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not create skill with topic id ${answerId}: ${err}`
                );
                reject(err);
            }
        });
    },

    //  unlike answer
    unlikeByAnswerId: (answerId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const group = await Group.findOne({
                    "qna.answers._id": ObjectId(answerId),
                });
                if (!group) throw "NOT_FOUND";
                const qna = group.qna.find(
                    (element) => element._id == data.question_id
                );
                // find index of the user in the array that matches the id
                const foundIndex = qna.answers.findIndex(
                    (element) => element._id == answerId
                );
                if (isNaN(foundIndex) && !foundIndex) throw "NOT_FOUND";

                const likeIndex = qna.answers[foundIndex].likes.findIndex(
                    (element) => element.member_id == data.member_id
                );

                if (isNaN(likeIndex) && !likeIndex) throw "NOT_FOUND";

                // delete member from members array
                qna.answers[foundIndex].likes.pull(
                    qna.answers[foundIndex].likes[likeIndex]
                );
                // save changes
                const result = await group.save();

                console.log("SUCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not delete like with id ${answerId}: ${err}`
                );
                reject(err);
            }
        });
    },
};

module.exports = { groupModel, Group };
