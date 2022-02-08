import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ScrollView, Picker, Pressable, Alert, TouchableOpacity, TextInput, } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons'
import { Title } from "react-native-paper";
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SelectDropdown from 'react-native-select-dropdown'
import { get } from "lodash";
import getLevel from "../../../axios/level-api/getLevel";
import createAssignment from "../../../axios/assignment-api/createAssignment";


export default NewQuizModal = ({isAdmin, userId, groupId, setUpdate}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");
  const [emailList, setEmailList] = useState();
  const [selectedList, setSelectedList] = useState();
  const [selectedListIndex, setSelectedListIndex] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [outputDateToCalendar, setoutputDateToCalendar] = useState("");
  const [title, settitle] = useState("")
  const [level, setlevel] = useState([]);
  const [topicfield, settopicfield] = useState();
  const [subtopicfield, setsubtopicfield] = useState();
  const [levelId, setLevelId] = useState();
  const [topicIdArray, setTopicIdArray] = useState([]);
  const [subTopicIdArray, setSubTopicIdArray] = useState([]);
  const [topicIndex, setTopicIndex] = useState();
  const [subTopicIndex, setSubTopicIndex] = useState();


  function displayDate(dt) {
    let date = new Date(dt);
    return date.toLocaleDateString();
  }

  function callAssignment () {
    let levelid = levelId;
    let topicArray = topicIdArray;
    let subTopicArray = subTopicIdArray;
    let deadline = new Date(outputDateToCalendar)
    deadline = deadline.toISOString().split("T")[0];

    let data = {
      title: title,
      level_id: levelid,
      topic_id: topicArray[topicIndex],
      skill_id: subTopicArray[subTopicIndex],
      deadline: deadline,
      assigned_by: userId,
      group_id: groupId,
    }
    createAssignment(data)
    .then(() => {
      resetState();
      setModalVisible(false);
      setUpdate(prevState => prevState + 1);
    })
  }

  function displayTopic(level) {
    
    settopicfield();
    setLevelId();
    setTopicIdArray([]);
    getLevel()
    .then((data) => {
      let topics = [];
      for(let i = 0; i < data.length; i++) {
        if(data[i].level == level) {
          setLevelId(data[i]._id);
          for(let x = 0; x < data[i].topics.length; x++) {
            topics.push(data[i].topics[x].topic_name);
            setTopicIdArray(prevState => [...prevState, data[i].topics[x]._id])
          }
          
        }
      }
      
      settopicfield(   
        <View>
            <Text style={styles.inputLabel}>Topic</Text>
            <SelectDropdown data={topics}
      buttonStyle={[styles.input,{ backgroundColor: '#E1F1FF', width:'100%' }]}
      buttonTextStyle={{textAlign:'left'}}
      dropdownStyle={{ borderRadius: 7 }}
      defaultButtonText="Select A Topic"
      buttonTextAfterSelection={(selectedItem, index) => {
        return selectedItem
      }}
      rowTextStyle={{ textAlign: 'left', marginHorizontal: 15 }}
      onSelect={(selectedItem, index) => { displaySubTopic(level, index), setTopicIndex(index)}} />
        </View>        
      
      
      );
      
    }) 
    
  }

  function displaySubTopic(level, topicIndex) {
    
    setSubTopicIdArray([]);
    setsubtopicfield();
    getLevel()
    .then((data) => {
      let subtopics = [];
      for(let i = 0; i < data[level-1].topics[topicIndex].skills.length; i++) {
        subtopics.push(data[level-1].topics[topicIndex].skills[i].skill_name)
        setSubTopicIdArray(prevState => [...prevState, data[level-1].topics[topicIndex].skills[i]._id])
      }

      

      setsubtopicfield(
            <View>
              <Text style={styles.inputLabel}>Sub-Topic</Text>
              <SelectDropdown data={subtopics}
              buttonStyle={[styles.input,{ backgroundColor: '#E1F1FF', width:'100%',}]}
              buttonTextStyle={{textAlign:'left'}}
              dropdownStyle={{ borderRadius: 7 }}

              defaultButtonText="Select A Skill"
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem
              }}
              rowTextStyle={{ textAlign: 'left', marginHorizontal: 15 }}
              onSelect={(selectedItem, index) => {setSubTopicIndex(index)}} />
            </View>
        
               
      );
      
    }) 
    
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setoutputDateToCalendar(displayDate(date.toString()));
    hideDatePicker();
  };

  function validateAssignment(data, callback) {
    let err = "";
    errInput = "";

    if (data.title == "") {
      errInput = "#title";
      err += "Please Enter a name for the assignment<br>";
    }
    if (data.level_id == "") {
      errInput == "" ? (errInput = "#level-select") : "";
      err += "Please select the grade/level of the assignment<br>";
    }
    if (data.topic_id == "") {
      errInput == "" ? (errInput = "#topic-select") : "";
      err += "Please select the topic of the assignment<br>";
    }
    if (data.skill_id == "") {
      errInput == "" ? (errInput = "#skill-select") : "";
      err += "Please select the sub-topic/skill of the assignment<br>";
    }
    if (data.deadline == "" || !validDeadline(data.deadline)) {
      errInput == "" ? (errInput = "#skill-select") : "";
      err += "Please enter a deadline that is today or after today<br>";
    }

    if (err == "") {
      callback();
    } else {
      document.querySelector(errInput).focus();
      document.querySelector("#error").innerHTML = err;
    }
  }

  function validDeadline(d) {
    var now = new Date();
    var today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    let userEntered = new Date(d);
    if (userEntered.getTime() < today.getTime()) return false;
    else if (userEntered.getTime() == today.getTime()) return true;
    else return true;
  }

  useEffect(() => {
    setlevel([]);
    for (let i = 0; i < 10; i++) {
      let levelName;
      if (i > 5) {
        levelName = "Secondary " + (i - 5)
      } else {
        levelName = "Primary " + (i + 1)
      }
      setlevel(prevState => [...prevState, levelName]);
    }

  }, []);

  function resetState() {
    settitle("");
    setoutputDateToCalendar("");
    settopicfield();
    setsubtopicfield();
    setLevelId();
    setTopicIdArray();
    setSubTopicIdArray();
    setTopicIndex();
    setSubTopicIndex();
  }

  return (
    <View> 
      {isAdmin?  <TouchableOpacity style={styles.createQuizButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.quizBtn}>Assign Quiz</Text>
      </TouchableOpacity>: <View></View>}
     
      <Modal isVisible={modalVisible}>
        <ScrollView>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={{ width: 40, alignSelf: 'flex-end', alignItems: 'center' }} onPress={() => { setModalVisible(false), resetState()}}>
              <FontAwesome5 name="times" size={40} color="black" />
            </TouchableOpacity>
            <View style={{ alignSelf: 'center' }}>
              <Text style={styles.modalHeader}>New Assignment</Text>
            </View>
            <View>

              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Give a name to the assignment"
                onChangeText={(e) => settitle(e)}
                value={title} 
              />
              <Text style={styles.inputLabel}>Deadline</Text>
              <View style={[styles.input, { flexDirection: "row", justifyContent: "space-between" }]}>
                <TextInput
                  style={{ fontSize: 20 }}
                  value={outputDateToCalendar}
                  placeholder="dd/mm/yyyy"
                  editable={false}
                  color="black"
                // onChangeText={}
                // value={}
                />
                <TouchableOpacity style={{ width: 24, height: 24, alignSelf: 'center' }} onPress={showDatePicker}>
                  <FontAwesome5 name="calendar" size={24} color="black" />
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </View>

              <Text style={styles.inputLabel}>Level</Text>
              
         
              <SelectDropdown data={level}
                buttonStyle={[ styles.input,{ backgroundColor: '#E1F1FF',width: '100%',  }]}
                buttonTextStyle={{textAlign:'left'}}
                dropdownStyle={{ borderRadius: 7,}}

                defaultButtonText="Select A Level"
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem
                }}
                rowTextStyle={{ textAlign: 'left', marginHorizontal: 15 }}
                onSelect={(selectedItem, index) => { displayTopic(index+1) }} />
                
              {/* <TextInput
                style={styles.input}
                placeholder="Select a Topic"

              /> */}
              
              {topicfield}
              {subtopicfield}
            </View>
            
            <View>
              {emailList}
              <View style={{ borderRadius: 10, backgroundColor: '#E9E7FA', marginTop: 20 }}>
                {selectedList}
              </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => {setModalVisible(false), resetState()}}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.createBtn} onPress={() => callAssignment()}>
                <Text style={styles.createBtnText}>Create</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
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
  },

  createQuizButton: {
    backgroundColor: '#B1DBFF',
    padding: 10,
    borderRadius: 7,
    marginVertical: 15,
    alignSelf: 'flex-start',
    marginLeft: 30,
    marginTop: 20,
  },

  quizBtn: {
    color: '#2A2A72',
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    fontSize: 20,
    
  },

  modalContainer: {
    display: 'flex',
    backgroundColor: "white",
    width: '50%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 30,
  },
  modalHeader: {
    fontFamily: 'Coolvetica',
    fontSize: 30,

  },
  input: {
    borderRadius: 15,
    backgroundColor: "#E1F1FF",
    borderColor: "#6696CA",
    borderWidth: 2.5,
    width: '100%',
    marginTop: 10,
    padding: 10,
    alignSelf: 'center',
    fontSize: 20
  },

  inputLabel: {
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,
    marginTop: 20
  },

  createBtn: {
    backgroundColor: '#6696CA',
    width: 100,
    height: 35,
    justifyContent: "center",
    textAlign: "center",
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 40,
    paddingVertical: 4,
    borderRadius: 15,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10
    },
    elevation: 10,
    shadowRadius: 100,
    shadowOpacity: 1,
    marginBottom: 20,
    marginHorizontal: 10,
  },

  createBtnText: {
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
  },

  cancelBtn: {
    backgroundColor: '#E22929',
    width: 100,
    height: 35,
    justifyContent: "center",
    textAlign: "center",
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 40,
    paddingVertical: 4,
    borderRadius: 15,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10
    },
    elevation: 10,
    shadowRadius: 100,
    shadowOpacity: 1,
    marginBottom: 20,
    marginHorizontal: 10,
  },

  cancelBtnText: {
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
  },

  emailList: {
    backgroundColor: '#E9E7FA',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  emailListImg: {
    width: 40,
    height: 40
  },
  listName: {
    fontWeight: 'bold'
  },
})