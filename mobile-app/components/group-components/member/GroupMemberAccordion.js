import React, {useEffect, useState} from "react";
import { StyleSheet, Text } from "react-native";
import getGroupMembers from "../../../axios/group-api/getGroupMembers";
import { List } from 'react-native-paper';
import GroupMemberItem from "./GroupMemberItem";

const GroupMemberAccordion = ({state, loading, update}) => {

    const [ownerArrow, setOwnerArrow] = useState("chevron-right")
    const [teacherArrow, setTeacherArrow] = useState("chevron-right")
    const [parentArrow, setParentArrow] = useState("chevron-right")
    const [studentArrow, setStudentArrow] = useState("chevron-right")
    const [owner, setOwner] = useState();
    const [ownerPic, setOwnerPic] = useState();
    const [teachers, setTeacher] = useState();
    const [parents, setParent] = useState();
    const [students, setStudent] = useState();

    const [teacherCount, setTeacherCount] = useState("Teachers");
    const [parentCount, setParentCount] = useState("Parents");
    const [studentCount, setStudentCount] = useState("Students");

    function toggleArrow(arrow, setArrow) {
        if (arrow == "chevron-right") {
            setArrow("chevron-down");
        }
        else {
            setArrow("chevron-right");
        }
    }

    useEffect(() => {
        getGroupMembers(state.groupId)
        .then(( data ) => {
            displayMembers(data)
        }).finally(() => {
            loading(false);
        })
    }, [update])

    function displayMembers(data) {
        let groupMembers = data.members;

        setOwner();
        setTeacher();
        setParent();
        setStudent();
        setOwner(data.owner.first_name + " " + data.owner.last_name);
        setOwnerPic(data.owner.pfp);
        let teacher = 0;
        let parent = 0;
        let student = 0;

        for (let i = 0; i < groupMembers.length; i++) {
            var user = <GroupMemberItem username={groupMembers[i].user_name} profileImg={groupMembers[i].pfp} isAdmin={groupMembers[i].is_admin}></GroupMemberItem>

            if (groupMembers[i].role == "teacher" || groupMembers[i].role == "admin") {
                setTeacher(prevState => [prevState, user])
                teacher++;
            }
            else if (groupMembers[i].role == "parent") {
                setParent(prevState => [prevState, user])
                parent++;
            }
            else {
                setStudent(prevState => [prevState, user])
                student++;
            }
        }

        setParentCount("Parents (" + parent + ")");
        setTeacherCount("Teachers (" + teacher + ")");
        setStudentCount("Students (" + student + ")");
    }

    return (
        <List.Section title="" style={{flex: 1, marginHorizontal: 40, marginVertical: 50}}>
            <List.Accordion
                left={props => <List.Icon {...props} icon={ownerArrow} />}
                right={props => <Text></Text>}
                title="Owner"
                titleStyle={styles.itemLabel}
                style={styles.listItem}
                onPress={() => {
                    toggleArrow(ownerArrow, setOwnerArrow)
                }}>
                <GroupMemberItem username={owner} profileImg={ownerPic} isAdmin={true}></GroupMemberItem>
            </List.Accordion>

            <List.Accordion
                left={props => <List.Icon {...props} icon={teacherArrow} />}
                right={props => <Text></Text>}
                title={teacherCount}
                style={styles.listItem}
                titleStyle={styles.itemLabel}
                onPress={() => {
                    toggleArrow(teacherArrow, setTeacherArrow)
                }}>
                {teachers}
            </List.Accordion>

            <List.Accordion
                left={props => <List.Icon {...props} icon={parentArrow} />}
                right={props => <Text></Text>}
                title={parentCount}
                style={styles.listItem}
                titleStyle={styles.itemLabel}
                onPress={() => {
                    toggleArrow(parentArrow, setParentArrow)
                }}>
                {parents}
            </List.Accordion>

            <List.Accordion
                left={props => <List.Icon {...props} icon={studentArrow} />}
                right={props => <Text></Text>}
                title={studentCount}
                style={styles.listItem}
                titleStyle={styles.itemLabel}
                onPress={() => {
                    toggleArrow(studentArrow, setStudentArrow)
                }}>
                {students}
            </List.Accordion>
        </List.Section>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    memberContainer: {
        flex: 1
    },
    contentContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        flex: 1,
    },
    listItem: {
        backgroundColor:'white',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    itemLabel: {
        fontWeight: 'bold',
        fontSize: 30,
        color: 'black'
    }
});

export default GroupMemberAccordion;