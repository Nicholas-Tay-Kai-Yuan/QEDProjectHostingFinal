import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, Picker, TouchableOpacity } from "react-native";
import { Title } from "react-native-paper";
import { useNavigate } from "react-router-native";
import getAssignmentBox from "../../axios/assignment-api/getAssignment"
import getLevel from "../../axios/level-api/getLevel";

const AssignmentBox = ({ post, assignmentStatus }) => {

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
    <TouchableOpacity style={styles.view} onPress={assignmentStatus == "Completed" ? () => navigate("/viewpastquiz", { state: { quizId: post.completed_quiz } }) : () => navigate("/QuizInstruction", { state: { levels: levels, tempSkillsID: post.skill_id, topicName: post.skill_name, assignmentId: post._id } })}>
      <View>
        <Title style={styles.assignmentTitle}>{post.title}</Title>
        <Text style={styles.assignmentText}>Assigned By: {post.assigned_by_name} ({post.group_name})</Text>
        <Text style={styles.skillsText}>{post.skill_name}</Text>
      </View>

      <View style={{ alignItems: 'center' }}>
        <Text style={styles.dateText}>{displayDate(post.deadline)}</Text>
        <Text style={(assignmentStatus == "Overdue") ? styles.overdue : (assignmentStatus == "Pending") ? styles.pending : styles.completed}>{assignmentStatus}</Text>
      </View>

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
    height: 150,
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginHorizontal: 22,
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 25,
  },

  assignmentTitle: {
    textDecorationLine: 'underline',
    marginTop: 17,
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
  }

});

export default AssignmentBox;