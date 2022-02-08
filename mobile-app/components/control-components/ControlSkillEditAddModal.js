import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import Modal from "react-native-modal";
import SelectDropdown from 'react-native-select-dropdown'
import { FontAwesome5 } from "@expo/vector-icons";
import deleteSkill from "../../axios/skill-api/deleteSkill";
import updateSkill from "../../axios/skill-api/updateSkill";
import addSkill from "../../axios/skill-api/addSkill";

export default ControlSkillEditAddModal = ({isVisible, setModalVisible, skill, update, modalType, topic}) => {

    // const [skillName, setSkillName] = useState(skill.skill_name);
    // const [skillCode, setSkillCode] = useState(skill.skill_code);
    // const [noOfQuestion, setNoOfQuestion] = useState(skill.num_of_qn.toString());
    // const [duration, setDuration] = useState(skill.duration.toString());
    // const [easyDifficulty, setEasyDifficulty] = useState(skill.percent_difficulty.substring(0, 2));
    // const [mediumDifficulty, setMediumDifficulty] = useState(skill.percent_difficulty.substring(3, 5));
    // const [difficultDifficulty, setDifficultDifficulty] = useState(skill.percent_difficulty.substring(6, 8));
    // const [easyMin, setEasyMin] = useState(skill.easy_values.min.toString());
    // const [easyMax, setEasyMax] = useState(skill.easy_values.max.toString());
    // const [mediumMin, setMediumMin] = useState(skill.medium_values.min.toString());
    // const [mediumMax, setMediumMax] = useState(skill.medium_values.max.toString());
    // const [hardMin, setHardMin] = useState(skill.difficult_values.min.toString());
    // const [hardMax, setHardMax] = useState(skill.difficult_values.max.toString());
    // const [percentDifficultyMsg, setPercentDifficultyMsg] = useState()
    // const [needsUpdate, setUpdate] = useState(0);
    // const [difficultySettings, setDifficultySettings] = useState(false);

    const [skillName, setSkillName] = useState("");
    const [skillCode, setSkillCode] = useState("");
    const [noOfQuestion, setNoOfQuestion] = useState("");
    const [duration, setDuration] = useState("");
    const [easyDifficulty, setEasyDifficulty] = useState("");
    const [mediumDifficulty, setMediumDifficulty] = useState("");
    const [difficultDifficulty, setDifficultDifficulty] = useState("");
    const [easyMin, setEasyMin] = useState("");
    const [easyMax, setEasyMax] = useState("");
    const [mediumMin, setMediumMin] = useState("");
    const [mediumMax, setMediumMax] = useState("");
    const [hardMin, setHardMin] = useState("");
    const [hardMax, setHardMax] = useState("");
    const [percentDifficultyMsg, setPercentDifficultyMsg] = useState()
    const [needsUpdate, setUpdate] = useState(0);
    const [difficultySettings, setDifficultySettings] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [isTenTimes, setTenTimes] = useState(true);

    const skillCodes = ["FRAC_SIMPLIFY", "FRAC_ADD", "FRAC_MULTIPLY", "FRAC_ADD_SUB", "ROUND_OFF", "INTEGERS_ADD_SUB", "ORDER_NUM", "RATIONAL_NUM"]

    useEffect(() => {
        if (skill == undefined) {
        }
        else {

            if (needsUpdate == 0) {
                setSkillName(skill.skill_name);
                setSkillCode(skill.skill_code);
                setNoOfQuestion(skill.num_of_qn.toString());
                setDuration(skill.duration.toString());
                setEasyDifficulty(skill.percent_difficulty.substring(0,2));
                setMediumDifficulty(skill.percent_difficulty.substring(3,5));
                setDifficultDifficulty(skill.percent_difficulty.substring(6,8));
                setEasyMin(skill.easy_values.min.toString());
                setEasyMax(skill.easy_values.max.toString());
                setMediumMin(skill.medium_values.min.toString());
                setMediumMax(skill.medium_values.max.toString());
                setHardMin(skill.difficult_values.min.toString());
                setHardMax(skill.difficult_values.max.toString());
            }
           

            if (skill.skill_code == "FRAC_SIMPLIFY" || skill.skill_code == "FRAC_ADD" || skill.skill_code == "FRAC_MULTIPLY") {
                setDifficultySettings(true);
            }
            else {
                setDifficultySettings(false);
            }
    
        }
        calculateQn();

    }, [needsUpdate]);

    useEffect(() => {
        if (noOfQuestion % 10 != 0) {
            setTenTimes(false);
        } 
        else {
            setTenTimes(true);
        }
    });

    function toggleDifficultySettings(selectedItem) {
        setSkillCode(selectedItem);

        if (selectedItem == "FRAC_SIMPLIFY" || selectedItem == "FRAC_ADD" || selectedItem == "FRAC_MULTIPLY") {
            setDifficultySettings(true);
        }
        else {
            setDifficultySettings(false);
        }
    }

    function calculateQn() {

        // check all values in params are multiple of 10
    
        let condition = noOfQuestion % 10 == 0 && easyDifficulty % 10 == 0 && mediumDifficulty % 10 == 0 && difficultDifficulty % 10 == 0;
        if (condition) {
            let easy_num = (easyDifficulty / 100) * noOfQuestion;
            let medium_num = (mediumDifficulty / 100) * noOfQuestion;
            let difficult_num = (difficultDifficulty / 100) * noOfQuestion;
            let total = easy_num + medium_num + difficult_num;
    
            setPercentDifficultyMsg(<Text style={styles.errorMsg}>Total Questions: {total}</Text>);
    
            if (noOfQuestion != total) {
                setPercentDifficultyMsg(<Text style={[styles.errorMsg, {color: 'red'}]}>Total Questions: {total} (Total not 100%)</Text>);
            }
            else {
                setPercentDifficultyMsg(<Text style={[styles.errorMsg, {color: 'black'}]}>Total Questions: {total}</Text>);
            }
        }
    }

    function removeSkill() {
        deleteSkill(skill._id)
        .then(() => {
            update(prevState => prevState + 1);
        })
    }

    function handleSkill() {
        setErrorMsg();

        let easyMinimum = easyMin;
        let easyMaximum = easyMax;
        let mediumMinimum = mediumMin;
        let mediumMaximum = mediumMax;
        let hardMinimum = hardMin;
        let hardMaximum = hardMax;

        if (skillCode != "FRAC_SIMPLIFY" && skillCode != "FRAC_ADD" && skillCode != "FRAC_MULTIPLY") {
            setEasyMin("0");
            setEasyMax("0");
            setMediumMin("0");
            setMediumMax("0");
            setHardMin("0");
            setHardMax("0");

            easyMinimum = "0";
            easyMaximum = "0";
            mediumMinimum = "0";
            mediumMaximum = "0";
            hardMinimum = "0";
            hardMaximum = "0";
        }

        let data = {
            skill_name: skillName,
            skill_code: skillCode,
            num_of_qn: noOfQuestion,
            duration: duration,
            percent_difficulty: `${easyDifficulty}-${mediumDifficulty}-${difficultDifficulty}`,
            easy_values: {
                min: easyMinimum,
                max: easyMaximum,
            },
            medium_values: {
                min: mediumMinimum,
                max: mediumMaximum,
            },
            difficult_values: {
                min: hardMinimum,
                max: hardMaximum,
            },
        };

        if (skill == undefined) {
            addSkill(topic._id, data)
            .then(() => {
                update(prevState => prevState + 1);
            })
            .catch((data) => {
                if (data.code == "INVALID_REQUEST") {
                    data.error.map((msg, index) => {
                        setErrorMsg(prevState => [prevState, <Text style={[styles.errorMsg, {color: 'red', marginVertical: 2}]} key={index}>{msg}</Text>])
                    })
                }
            });
        }
        else {
            updateSkill(skill._id, data)
            .then(() => {
                update(prevState => prevState + 1);
            })
            .catch((data) => {
                if (data.code == "INVALID_REQUEST") {
                    data.error.map((msg, index) => {
                        setErrorMsg(prevState => [prevState, <Text style={[styles.errorMsg, {color: 'red', marginVertical: 2}]} key={index}>{msg}</Text>])
                    })
                }
            })
        }
    }

    return (
        <Modal isVisible={isVisible}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalRow}>
                        <Text style={styles.modalHeader}>{modalType == "edit" ? "Edit Skill" : "Add Skill"}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <FontAwesome5 name="times" size={30} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalRow}>
                        <View style={{marginRight: 40}}>
                            <Text style={styles.modalFieldLabel}>Skill Name</Text>
                            <TextInput
                                style={[styles.input, {paddingHorizontal: 15}]}
                                onChangeText={(e) => setSkillName(e)}
                                value={skillName}
                            />                            
                        </View>
                        <View>
                            <Text style={styles.modalFieldLabel}>Skill Code</Text>
                            <SelectDropdown data={skillCodes} 
                                buttonStyle={styles.input}
                                defaultButtonText={skillCode == "" ? "Choose the algorithm used for the topic" : skillCode}
                                buttonTextStyle={{textAlign: 'left', marginHorizontal: 15}}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem
                                }}
                                rowTextStyle={{textAlign: 'left', marginHorizontal: 15}} 
                                onSelect={(selectedItem, index) => {toggleDifficultySettings(selectedItem)}} />
                        </View>
                    </View>
                    <View style={styles.modalRow}>
                        <View style={{marginRight: 40}}>
                            <Text style={styles.modalFieldLabel}>Number of Questions in a Quiz</Text>
                            <TextInput
                                style={[styles.input, {paddingHorizontal: 15}]}
                                keyboardType="numeric"
                                onChangeText={(e) => setNoOfQuestion(e.replace(/[^0-9]/g, ''))}
                                value={noOfQuestion}
                            />                            
                        </View>
                        <View>
                            <Text style={styles.modalFieldLabel}>Quiz Duration</Text>
                            <View style={[styles.input, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                                <TextInput
                                    style={{paddingHorizontal: 15, fontSize: 20, width: 320}}
                                    keyboardType="numeric"
                                    onChangeText={(e) => setDuration(e.replace(/[^0-9]/g, ''))}
                                    value={duration}
                                />  
                                <Text style={{textAlignVertical: 'center', fontSize: 20, marginRight: 15}}>mins</Text>
                            </View>                          
                        </View>
                    </View>
                    {isTenTimes ? <View></View>: <Text style={[styles.errorMsg, {color: 'red'}]}>Must be a multiple of 10</Text>}
                    <View style={{alignSelf: 'flex-start'}}>
                        <Text style={styles.modalFieldLabel}>Percentage Difficulty of Quiz</Text>
                        <View style={styles.percentDifficultyRow}>
                            <Text style={[styles.percentDifficultyLabel, {width: "25%"}]}>Easy</Text>
                            <Text style={[styles.percentDifficultyLabel, {width: "8%"}]}>:</Text>
                            <TextInput
                                style={[styles.input, {width: 300, paddingHorizontal: 15, width: "66%"}]}
                                keyboardType="numeric"
                                onChangeText={(e) => {setEasyDifficulty(e.replace(/[^0-9]/g, '')), setUpdate(prevState => prevState + 1)}}
                                value={easyDifficulty}
                            />  
                        </View>
                        <View style={styles.percentDifficultyRow}>
                            <Text style={[styles.percentDifficultyLabel, {width: "25%"}]}>Medium</Text>
                            <Text style={[styles.percentDifficultyLabel, {width: "8%"}]}>:</Text>
                            <TextInput
                                style={[styles.input, { paddingHorizontal: 15, width: "66%"}]}
                                keyboardType="numeric"
                                onChangeText={(e) => {setMediumDifficulty(e.replace(/[^0-9]/g, '')), setUpdate(prevState => prevState + 1)}}
                                value={mediumDifficulty}
                            />  
                        </View>
                        <View style={styles.percentDifficultyRow}>
                            <Text style={[styles.percentDifficultyLabel, {width: "25%"}]}>Difficult</Text>
                            <Text style={[styles.percentDifficultyLabel, {width: "8%"}]}>:</Text>
                            <TextInput
                                style={[styles.input, {width: 300, paddingHorizontal: 15, width: "66%"}]}
                                keyboardType="numeric"
                                onChangeText={(e) => {setDifficultDifficulty(e.replace(/[^0-9]/g, '')), setUpdate(prevState => prevState + 1)}}
                                value={difficultDifficulty}
                            />  
                        </View>
                    </View>
                    {percentDifficultyMsg}
                    {difficultySettings ? 
                    <View style={styles.modalRow}>
                        <View>
                            <Text style={styles.modalFieldLabel}>Difficulty Settings</Text>
                            <View style={{flexDirection: 'row', width: "50%"}}>
                                <Text style={[styles.modalFieldLabel, {width: "30%"}]}></Text>
                                <Text style={[styles.modalFieldLabel, {width: "8%"}]}></Text>
                                <Text style={[styles.modalFieldLabel, {width: 300, textAlign: 'center', marginRight: 40}]}>Minimum Value</Text>
                                <Text style={[styles.modalFieldLabel, {width: 300, textAlign: 'center'}]}>Maximum Value</Text>
                            </View>
                            <View style={{flexDirection: 'row', width: "50%", marginTop: 10}}>
                                <Text style={[styles.modalFieldLabel, {width: "30%"}]}>Easy</Text>
                                <Text style={[styles.modalFieldLabel, {width: "8%"}]}>:</Text>
                                <TextInput 
                                    style={[styles.input, {width: 300, paddingHorizontal: 15, marginRight: 40}]}
                                    keyboardType="numeric"
                                    onChangeText={(e) => setEasyMin(e.replace(/[^0-9]/g, ''))}
                                    value={easyMin}
                                />
                                <TextInput 
                                    style={[styles.input, {width: 300, paddingHorizontal: 15}]}
                                    keyboardType="numeric"
                                    onChangeText={(e) => setEasyMax(e.replace(/[^0-9]/g, ''))}
                                    value={easyMax}
                                />
                            </View>
                            <View style={{flexDirection: 'row', width: "50%", marginTop: 10}}>
                                <Text style={[styles.modalFieldLabel, {width: "30%"}]}>Medium</Text>
                                <Text style={[styles.modalFieldLabel, {width: "8%"}]}>:</Text>
                                <TextInput 
                                    style={[styles.input, {width: 300, paddingHorizontal: 15, marginRight: 40}]}
                                    keyboardType="numeric"
                                    onChangeText={(e) => setMediumMin(e.replace(/[^0-9]/g, ''))}
                                    value={mediumMin}
                                />
                                <TextInput 
                                    style={[styles.input, {width: 300, paddingHorizontal: 15}]}
                                    keyboardType="numeric"
                                    onChangeText={(e) => setMediumMax(e.replace(/[^0-9]/g, ''))}
                                    value={mediumMax}
                                />
                            </View>
                            <View style={{flexDirection: 'row', width: "50%", marginTop: 10}}>
                                <Text style={[styles.modalFieldLabel, {width: "30%"}]}>Difficult</Text>
                                <Text style={[styles.modalFieldLabel, {width: "8%"}]}>:</Text>
                                <TextInput 
                                    style={[styles.input, {width: 300, paddingHorizontal: 15, marginRight: 40}]}
                                    keyboardType="numeric"
                                    onChangeText={(e) => setHardMin(e.replace(/[^0-9]/g, ''))}
                                    value={hardMin}
                                />
                                <TextInput 
                                    style={[styles.input, {width: 300, paddingHorizontal: 15}]}
                                    keyboardType="numeric"
                                    onChangeText={(e) => setHardMax(e.replace(/[^0-9]/g, ''))}
                                    value={hardMax}
                                />
                            </View>
                        </View>
                    </View>
                    :<View></View>}
                    {errorMsg}
                    <View style={[styles.modalRow, {justifyContent: 'flex-end'}]}>
                        {skill == undefined ? 
                        <View></View>: 
                        <TouchableOpacity style={styles.deleteSkillBtn} onPress={() => removeSkill()}>
                            <FontAwesome5 name="minus" size={24} color="white" />
                            <Text style={styles.btnText}>Delete Skill</Text>
                        </TouchableOpacity>}
                        <TouchableOpacity style={styles.editSkillBtn} onPress={() => handleSkill()}>
                            <FontAwesome5 name="plus" size={24} color="white" />
                            <Text style={styles.btnText}>Submit Skill</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: "white",
        alignSelf: 'center',
        borderRadius: 5,
        padding: 30,
        justifyContent: 'center',
    },
    input: {
        borderRadius: 20,
        backgroundColor: '#f3f3f3',
        padding: 7,
        width: 400,
        height: 50,
        fontSize: 20
    },
    modalHeader: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20
    },
    modalFieldLabel: {
        fontSize: 20,
        marginVertical: 10,
        fontWeight: 'bold'
    },
    modalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    percentDifficultyLabel: {
        fontSize: 20,
        textAlignVertical: 'center',
    },
    percentDifficultyRow: {
        flexDirection: 'row',
        width: '30%',
        marginTop: 20
    },
    errorMsg: {
        fontSize: 20,
        marginVertical: 20,
        fontWeight: 'bold'
    },
    deleteSkillBtn: {
        backgroundColor: '#fa5858',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 7,
    },
    editSkillBtn: {
        backgroundColor: '#6696ca',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 7,
        marginLeft: 15
    },
    btnText: {
        color: 'white',
        fontSize: 20,
        marginLeft: 15
    }
});
