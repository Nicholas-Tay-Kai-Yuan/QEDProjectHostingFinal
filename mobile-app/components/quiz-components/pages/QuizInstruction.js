import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import QuizButton from "../components/QuizButton";
import { useLocation, useSearchParams, useNavigate } from "react-router-native";
import getSkill from "../../../axios/skill-api/getSkill";

export default QuizInstruction = () => {
  const { state } = useLocation();
  // console.log(state.tempSkillsID);
  // console.log(state.topicName);
  // console.log("levels");
  // console.log(state.levels);
  const navigate = useNavigate();
  const [noOfQns, setNoOfQns] = useState();
  const [skillName, setSkillName] = useState();
  const [duration, setDuration] = useState();
  const [display, setDisplay] = useState();
  const [quizData, setQuizData] = useState();

  useEffect(() => {
    setQuizData();
    getSkill(state.tempSkillsID).then((data) => {
      let noOfQns = data.num_of_qn;
      setNoOfQns(noOfQns);
      setSkillName(data.skill_name);
      setDuration(data.duration);
      setQuizData(data);

      if (data.level >= 7) {
        setDisplay("Secondary " + (data.level - 6));
      } else {
        setDisplay("Primary " + data.level);
      }
    });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.page}>
          <Image
            style={styles.image}
            source={require("../../../assets/Psleonline_logo_transparent.png")}
          ></Image>
          <Text style={styles.levelText}>{display}</Text>
          <Text style={styles.skillName}>{skillName}</Text>
          <Text style={styles.timeText}>
            <AntDesign name="clockcircle" size={24} color="black" />
            Time Limit: {duration} Minutes
          </Text>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={["#83A4D4", "#B6FBFF"]}
            style={styles.containerGradient}
          >
            <Text style={styles.instructionsHeader}>Instructions</Text>
            <Text style={styles.instructionsText}>
              Test will be saved and submit automatically when timer is up
            </Text>
            <Text style={styles.instructionsText}>
              You are required to finish the test in one sitting
            </Text>
            <Text style={styles.instructionsText2}>
              There are a total of {noOfQns} questions in the quiz
            </Text>
            <Text style={styles.instructionsText}>
              Answer all of the questions
            </Text>
          </LinearGradient>
          <QuizButton
            color="#3DB3FF"
            onClick={() => {state.assignmentId ?
              navigate("/DoQuiz", {
                state: {
                  topicName: state.topicName,
                  levels: state.levels,
                  quizData: quizData,
                  display: display,
                  skillName: skillName,
                  duration: duration,
                  assignmentId: state.assignmentId
                },
              }) :

              navigate("/DoQuiz", {
                state: {
                  topicName: state.topicName,
                  levels: state.levels,
                  quizData: quizData,
                  display: display,
                  skillName: skillName,
                  duration: duration,
                },
              }) 
            }}
          >
            Begin Quiz
          </QuizButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  page: {
    height: 950,
  },
  image: {
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.45,
    resizeMode: "contain",
    height: Dimensions.get("window").width * 0.2,
  },
  levelText: {
    fontSize: 30,
    alignSelf: "center",
    fontWeight: "bold",
  },
  skillName: {
    fontSize: 40,
    alignSelf: "center",
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "bold",
  },
  containerGradient: {
    borderRadius: 15,
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.5,
    marginVertical: 30,
    height: 430,
  },
  instructionsHeader: {
    alignSelf: "center",
    fontSize: 40,
    color: "#FFFFFF",
    fontWeight: "bold",
    paddingVertical: 40,
  },
  instructionsText: {
    alignSelf: "center",
    fontSize: 23,
    color: "#FFFFFF",
    paddingVertical: 10,
  },
  instructionsText2: {
    alignSelf: "center",
    fontSize: 23,
    color: "#FFFFFF",
    paddingBottom: 10,
    paddingTop: 40,
  },
  quizButton: {
    alignSelf: "center",
  },
});
