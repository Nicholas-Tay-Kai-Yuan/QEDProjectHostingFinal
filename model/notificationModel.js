const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Assignment, assignmentModel } = require("./assignmentModel");
const { Schema } = mongoose;
const { Group, groupModel } = require("./groupModel.js");

// creating user notification schema
const NotificationSchema = new Schema({
    owner: {
        type: ObjectId,
    },
    unread: {
        type: Boolean,
        default: true,
    },
    assignment_id: {
        type: ObjectId,
    },
    skill_id: {
        type: ObjectId,
    },
    group_id: {
        type: ObjectId,
    },
    teacher_id: {
        type: ObjectId,
    },
    content: {
        type: String,
        required: "Content is required",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Notification = mongoose.model("Notification", NotificationSchema);

const notificationModel = {
    NotificationSchema,
    /**
     * Website Notification
     */
    // get all notification by user id
    getNotificationByUser: (user_id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Notification.aggregate([
                    {
                        $match: {
                            owner: ObjectId(user_id),
                        },
                    },
                    {
                        $sort: {
                            created_at: -1,
                        },
                    },
                    {
                        $addFields: {
                            dateDifference: {
                                $subtract: ["$$NOW", "$created_at"],
                            },
                        },
                    },
                    {
                        $match: {
                            dateDifference: { $gte: 0 },
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            as: "teacher",
                            localField: "teacher_id",
                            foreignField: "_id",
                        },
                    },
                    {
                        $lookup: {
                            from: "groups",
                            as: "group",
                            localField: "group_id",
                            foreignField: "_id",
                        },
                    },
                    {
                        $project: {
                            group_id: 0,
                            group: {
                                members: 0,
                                posts: 0,
                                __v: 0,
                                owner: 0,
                            },
                            teacher: {
                                password: 0,
                                email: 0,
                                gender: 0,
                                role: 0,
                                created_at: 0,
                                __v: 0,
                            },
                            dateDifference: 0,
                        },
                    },
                ]);
                if (!result) throw "NOT_FOUND";

                console.log("SUCCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(
                    "ERROR! Could not get notifications by userid:",
                    err
                );
                reject(err);
            }
        });
    },

    // Triggers when there is a new assignment being assigned
    createNewAssignmentNotification: (assignment, content) => {
        return new Promise(async (resolve, reject) => {
            try {
                const [group] = await Assignment.aggregate([
                    {
                        $match: { _id: ObjectId(assignment._id) },
                    },
                    {
                        $project: { group_id: 1, _id: 0 },
                    },
                ]);

                const groupMembers = await Group.aggregate([
                    {
                        $match: { _id: group.group_id },
                    },
                    {
                        $project: {
                            _id: 0,
                            group_name: 0,
                            owner: 0,
                            posts: 0,
                        },
                    },
                    {
                        $unwind: "$members",
                    },
                    {
                        $replaceRoot: {
                            newRoot: "$members",
                        },
                    },
                    {
                        $project: {
                            user_id: 1,
                        },
                    },
                ]);

                const newNotis = [];
                for (let member of groupMembers) {
                    console.log("Assignment Id: " + assignment.skill_id);
                    newNotis.push(
                        new Notification({
                            owner: member.user_id,
                            assignment_id: ObjectId(assignment._id),
                            skill_id: ObjectId(assignment.skill_id),
                            teacher_id: ObjectId(assignment.assigned_by),
                            content: content,
                        })
                    );
                }

                const result = await Notification.collection.insertMany(
                    newNotis
                );

                if (!result) throw "UNEXPECTED_ERROR";

                console.log("SUCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(
                    "ERROR! Could not create notification by asgId",
                    err
                );
                reject(err);
            }
        });
    },

    // Creates and push notifications for assignment deadline if it is not yet completed
    createAssignmentReminderNotification: (assignment) => {
        return new Promise(async (resolve, reject) => {
            try {
                const userIds = (
                    await assignmentModel.getAsgProgressbyAsgId(assignment._id)
                ).map(({ user_id }) => user_id);

                const now = new Date();
                const deadline = new Date(assignment.deadline);
                const newNotis = [];
                const msPerDay = 86400000;

                const triggerDates = [
                    deadline - msPerDay,
                    deadline - msPerDay * 2,
                    deadline - msPerDay * 3,
                ];

                for (let index in triggerDates) {
                    console.log(triggerDates[index])
                    console.log(now.getTime())
                    console.log(new Date(triggerDates[index]) - new Date(now.getTime()))
                    if (triggerDates[index] - now.getTime() < 0) {
                        break;
                    }
                    for (let userId of userIds) {
                        newNotis.push(
                            new Notification({
                                owner: userId,
                                teacher_id: ObjectId(assignment.assigned_by),
                                assignment_id: ObjectId(assignment._id),
                                skill_id: ObjectId(assignment.skill_id),
                                content: `You have uncompleted homework! Your deadline is in ${
                                    parseInt(index) + 1
                                } days left, start doing them here now!`,
                                created_at: triggerDates[index],
                                group_id: assignment.group_id,
                            })
                        );
                    }
                }

                console.log(
                    "New Notifications for assignment reminder : " + newNotis.length
                );

                let result = [];
                if (newNotis.length > 0)
                    result = await Notification.collection.insertMany(newNotis);

                if (!result) throw "UNEXPECTED_ERROR";

                console.log("SUCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error(
                    "ERROR! Could not create notification by asgId",
                    err
                );
                reject(err);
            }
        });
    },

    // Create assignment notification when assignment has expired or when all students have completed
    createAssignmentMarkingNotification: (assignment, early) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Find students who haven't complete their assignment
                const userIds = (
                    await assignmentModel.getAsgProgressbyAsgId(assignment._id)
                ).map(({ user_id }) => user_id);

                let result, content;

                if (userIds.length > 0 && !early) {
                    // This checks for if there is student who has not complete it after deadline
                    content =
                        "Your assigned homework has expired, check out the students’ performance here!";
                } else if (userIds.length <= 0 && early) {
                    // This check for if all student completed before deadline
                    content =
                        "All students have completed your homework, check their performance here!";
                }

                if (content) {
                    result = await Notification.collection.insertOne(
                        new Notification({
                            owner: assignment.assigned_by,
                            assignment_id: assignment._id,
                            group_id: assignment.group_id,
                            content: content,
                            created_at: early
                                ? Date.now()
                                : assignment.deadline,
                        })
                    );
                }
                return resolve(result);
            } catch (err) {
                console.error(
                    "ERROR! Could not create notification by asgId",
                    err
                );
                reject(err);
            }
        });
    },

    createLeaderboardChangesNotification: (assignment_id) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Find students in the group of the assignment
                const userIds = (
                    await assignmentModel.getGroupMembersbyAsgId(assignment_id)
                ).map(({ user_id }) => user_id);

                const { group_name, _id } =
                    await assignmentModel.getGroupByAsgId(assignment_id);

                const newNotis = [];
                for (let userId of userIds) {
                    newNotis.push(
                        new Notification({
                            owner: userId,
                            group_id: ObjectId(_id),
                            content: `There have been changes in the leaderboard in your group, ${group_name}, check out the new leaderboard here!`,
                        })
                    );
                }
                const result = await Notification.collection.insertMany(
                    newNotis
                );
                return resolve(result);
            } catch (err) {
                console.error(
                    "ERROR! Could not create notification by asgId",
                    err
                );
                reject(err);
            }
        });
    },

    // dismiss noti for user by id
    dismissNotificationById: (notificationId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const noti = await Notification.findOne({
                    _id: ObjectId(notificationId),
                });
                if (!noti) throw "NOT_FOUND";

                const readStatus = noti.unread;

                if (readStatus) throw "UNEXPECTED_ERROR";

                noti.unread = !readStatus;
                const result = noti.save();

                console.log("Result: ", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not delete noti with id ${notificationId}: ${err}`
                );
                reject(err);
            }
        });
    },

    deleteNotification: (notificationId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Notification.findByIdAndDelete(ObjectId(notificationId));

                if (!result) throw "NOT_FOUND";

                console.log("Result: ", result);
                resolve(result);
            } catch (err) {
                console.error(
                    `ERROR! Could not delete notification with id ${notificationId}: ${err}`
                );
                reject(err);
            }
        });
    },

    getAllNotifications: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Notification.find().select();

                if (!result) throw "UNEXPECTED_ERROR";
                
                console.log("SUCCESS! Result", result);
                resolve(result);
            } catch (err) {
                console.error("ERROR! Could not get all notifications:", err);
                reject(err);
            }
        })
    },
};

module.exports = notificationModel;
