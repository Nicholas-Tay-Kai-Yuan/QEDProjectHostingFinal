import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, Picker, TouchableOpacityBase, TouchableOpacity } from "react-native";
import { Title } from "react-native-paper";
import getOutstandingAssignment from "../../../axios/assignment-api/getOutstandingAssignment";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigate } from "react-router-native";
import getLevel from "../../../axios/level-api/getLevel";

const GroupAssignmentBox = ({ post, assignmentStatus, groupId }) => {
  
  const [tableVisible, setTableVisible] = useState(false)
  const [levels, setLevels] = useState([]);

  let navigate = useNavigate();
  
  useEffect(() => {
    getLevel()
      .then((data) => {
        setLevels(data);
      })
  }, []);

  function displayDate(dt) {
    let date = new Date(dt);
    let today = new Date(Date.now());

    let result = (date.toDateString() == today.toDateString()) ?
      "Today" :
      date.toDateString()
    return result;
  }

  return (
    <TouchableOpacity style={styles.view} onPress={post.member_assignment == undefined ? !post.completed_quiz ? () => navigate("/QuizInstruction", {state: {levels: levels, tempSkillsID: post.skill_id, topicName: post.skill_name, assignmentId: post._id}}): () => navigate("/viewpastquiz", {state: {quizId: post.completed_quiz}}) : () => {tableVisible ? setTableVisible(false): setTableVisible(true)}}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {post.member_assignment == undefined ? <View></View> : <FontAwesome style={{marginLeft: 15, marginBottom: 15}} name={tableVisible ? "chevron-down" : "chevron-right"} size={17} color="black" />}
            <Title style={styles.assignmentTitle}>{post.title}</Title>
          </View>
          <Text style={styles.assignmentText}>Assigned By: {post.assigned_by_name} ({post.group_name})</Text>
          <Text style={styles.skillsText}>{post.skill_name}</Text>
        </View>

        <View style={{ alignItems: 'center', }}>
          <Text style={styles.dateText}>{displayDate(post.deadline)}</Text>
          <Text style={(assignmentStatus == "Overdue") ? styles.overdue : (assignmentStatus == "Pending") ? styles.pending : (assignmentStatus == "Completed") ? styles.completed : styles.all}>{assignmentStatus}</Text>
        </View>
      </View>
  
      {post.member_assignment == undefined ? <View></View>: tableVisible ? <View style={styles.tableView}>
        <View style={{ flexDirection: 'row', backgroundColor: '#2A2A72', borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingHorizontal: 15}}>
          <View style={styles.tableHeaderTotal} ><Text style={styles.tableHeaderText}>Student</Text></View>
          <View style={styles.tableHeaderTotal} ><Text style={styles.tableHeaderText}>Status</Text></View>
          <View style={styles.tableHeaderTotal} ><Text style={styles.tableHeaderText}>Score</Text></View>
          <View style={styles.tableHeaderTotal} ><Text style={styles.tableHeaderText}>Time Taken</Text></View>
        </View>

        <View style={{paddingHorizontal: 15}}>
        {post.member_assignment.map((member_assignment, index) => (
           <TouchableOpacity style={{flexDirection: 'row'}} onPress={member_assignment.isCompleted != undefined && member_assignment.isCompleted ? () => navigate("/viewpastquiz", {state: {quizId: member_assignment._id}}): () => console.log("not completed")}>
            <View style={[styles.tableContentTotal, {borderTopLeftRadius: 0}]} ><Text style={[styles.tableContentText, {color: 'black'}]}>{member_assignment.name}</Text></View>
            <View style={styles.tableContentTotal} >
              <View style={[member_assignment.isCompleted == undefined || member_assignment.isCompleted == null ? {backgroundColor: '#ffe1e5'} : !member_assignment.isCompleted ? {backgroundColor: '#fff6de'} : {backgroundColor: '#e4fad8'} , styles.statusBar]}>
                <FontAwesome name= {member_assignment.isCompleted == undefined || member_assignment.isCompleted == null ? "times-circle" : !member_assignment.isCompleted ? "minus-circle" : "check-circle"} size={24} color={member_assignment.isCompleted == undefined || member_assignment.isCompleted == null ? '#ef798a' : !member_assignment.isCompleted ? "#ffcb45" : "#5ba93a"}/>
                <Text style={member_assignment.isCompleted == undefined || member_assignment.isCompleted == null ? styles.statusNotStartedTextColor: !member_assignment.isCompleted ? styles.statusPendingTextColor: styles.statusCompletedTextColor}>{member_assignment.isCompleted == undefined || member_assignment.isCompleted == null ? "Not Started" : !member_assignment.isCompleted ? "In Progress" : "Completed"}</Text>
              </View>
              </View>
              <View style={styles.tableContentTotal} ><Text style={[styles.tableContentText, {color: 'black'}]}>{!member_assignment.isCompleted ?  "-" : member_assignment.score.total.toFixed(1) + "%"}</Text></View>
              <View style={styles.tableContentTotal} ><Text style={[styles.tableContentText, {color: 'black'}]}>{!member_assignment.isCompleted ?  "-" : member_assignment.time_taken + "s"}</Text></View>
            </TouchableOpacity>
        ))}
        </View>
      </View> : <View></View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  view: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginHorizontal: 22,
    marginBottom: 25,
    paddingVertical: 17
  },

  assignmentTitle: {
    textDecorationLine: 'underline',
    marginLeft: 15,
    marginBottom: 15,
    fontFamily: 'Feather',
  },

  assignmentText: {
    marginLeft: 15,

  },

  dateText: {
    fontFamily: 'Poppins',
    marginLeft: 15,
    alignItems: 'flex-end',
    marginTop: 10,
    marginRight: 10,
  },

  assignmentState: {
    color: '#FF5A5A',
    backgroundColor: '#F3C5C5',
    marginLeft: 15,
    width: 80,
    alignItems: 'flex-end',
    borderColor: '#F3C5C5',
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 4,
  },

  skillsText: {
    color: '#63A6E4',
    backgroundColor: '#EBF0FF',
    marginTop: 15,
    marginLeft: 15,
    width: 145,
    borderWidth: 1,
    borderColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 3,
  },

  overdue: {
    textAlign: "center",
    width: 120,
    color: '#FF5A5A',
    backgroundColor: '#F3C5C5',
    borderWidth: 1,
    borderColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 4,
  },

  pending: {
    textAlign: "center",
    width: 120,
    color: '#63A6E4',
    backgroundColor: '#EBF0FF',
    borderWidth: 1,
    borderColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 4,
  },

  completed: {
    textAlign: "center",
    width: 120,
    color: '#2DDD69',
    backgroundColor: '#D4F3C5',
    borderWidth: 1,
    borderColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 4,
  },

  tableView: {
    // flexDirection: 'column'
    backgroundColor: '#DCEDFD',
    margin: 17,
    borderRadius: 10,
  },

  
  tableHeaderTotal: {
    flex: 1,
    alignSelf: 'stretch',
    marginVertical: 5
  },


  tableHeaderText: {
    color: 'white',
    fontFamily: 'Feather',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17
  },

  tableContentText: {
    color: 'white',
    fontFamily: 'Poppins',
    textAlign: 'center',
    fontSize: 20
  },

  tableContentTotal: {
    flex: 1,
    alignSelf: 'center',
    marginVertical: 15,
  },

  statusPendingTextColor: {
    fontSize: 17,
    color: '#ffcb45',
    
  },

  statusNotStartedTextColor: {
    fontSize: 17,
    color: '#ef798a',
  },


  statusCompletedTextColor: {
    fontSize: 17,
    color: '#5ba93a',
  },

  statusBar: {
    flexDirection: 'row',
    marginHorizontal: 30, 
    padding: 10, 
    borderRadius: 30,
    justifyContent: 'space-evenly', 
    alignItems: 'center'
  },

});

export default GroupAssignmentBox;