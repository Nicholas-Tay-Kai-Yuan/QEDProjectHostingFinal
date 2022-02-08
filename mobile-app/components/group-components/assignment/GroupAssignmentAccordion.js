import React, { useEffect, useState } from "react";
import { List } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";
import GroupAssignmentBox from "./GroupAssignmentItem";


const GroupAssignmentAccordian = ({ assignments = [], type, groupId }) => {

    const [arrow, setArrow] = useState("chevron-right");

    const assignmentDeadline = new Date(assignments.deadline);
    const [teacherAssignment, setteacherAssignment] = useState([])
    const currentDateTime = new Date();
    // Teacher view

    function displayStudentProgress() {

            // if (type == "") {
            //     //for educator: displays status of each member in the group
            //     let fullyCompleted = true;

            //     let statusContent = "";
            //     console.log("checkcheck")
            //     statusContent += `
                               
            //                 `;
            //     for (let i = 0; i < assignments.member_assignment.length; i++) {
            //         let status = assignments.member_assignment[i];
            //         statusContent += `
            //                         ${status.isCompleted ? "" : ""
            //             }">
            //                             ${status.name}
                                        
            //                             ${status.isCompleted == undefined ||
            //                 status.isCompleted == null
            //                 ? ''
            //                 : ""
            //             }   
        
            //                             ${status.isCompleted == false
            //                 ? ''
            //                 : ""
            //             }
                
            //                             ${status.isCompleted == true
            //                 ? ``
            //                 : ""
            //             }
                
                                        
            //                                 ${status.isCompleted == true
            //                 ? status.score.total.toFixed(1) +
            //                 "%"
            //                 : "-"
            //             }
                                        
                
                                       
            //                                 ${status.isCompleted == true
            //                 ? status.time_taken + "s"
            //                 : "-"
            //             }
                                       
            //              `;
            //         fullyCompleted =
            //             fullyCompleted &&
            //             (assignments.member_assignment[i].isCompleted
            //                 ? assignments.member_assignment[i].isCompleted
            //                 : false);
        
            //     }
            //     completedAssignment += `
            //     ${assignments.skill_id
            //         }${assignments._id}${assignments.completed_quiz
            //         }
            //                         ${assignments.title
            //         }${assignments.assigned_by_name
            //         }
            //                         ${assignments.skill_name
            //         }
            //                  ${displayDate(
            //             assignments.deadline
            //         )}
                         
            //                 ${statusContent}
                              
            //     `;
        
            // }
    }

    return (
        <View onLayout={() => displayStudentProgress()}>
             <List.Accordion
            style={styles.List}
            title={`${type} Assignment (${assignments.length})`}
            titleStyle={styles.Title}
            onPress={() =>
                setArrow((prev) =>
                    prev === "chevron-right" ? "chevron-down" : "chevron-right"
                )
            }
            left={(props) => <List.Icon {...props} icon={arrow} />}
            right={() => <Text></Text>}
        >
            {assignments.map((assignment, index) => (
                <GroupAssignmentBox
                    key={index}
                    post={assignment}
                    assignmentStatus={type}
                    groupId={groupId}
                />
            ))}
        </List.Accordion>
        </View>
       
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    Test: {
        marginTop: 50,
        marginBottom: 15,
        alignItems: "center",
    },
    List: {
        backgroundColor: "white",
    },
    Section: {
        marginHorizontal: 50,
    },

    Title: {
        color: "black",
    },
});

export default GroupAssignmentAccordian;
