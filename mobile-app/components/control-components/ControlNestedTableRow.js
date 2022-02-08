import React, {useState} from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ControlSkillEditAddModal from "./ControlSkillEditAddModal";
import ControlTableRow from "./ControlTableRow";

export default ControlNestedTableRow = ({topic, setUpdate}) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState();

    return (
        <View>
            <View style={[styles.row, {backgroundColor: '#6696ca', borderTopLeftRadius: 7, borderTopRightRadius: 7}]}>
                <Text style={[styles.cellSpace, styles.headerText, {flex: 1}]}></Text>            
                <Text style={[styles.cellSpace, styles.headerText, {flex: 4}]}>Skill Name</Text>
                <Text style={[styles.cellSpace, styles.headerText, {flex: 2}]}>Skill Code</Text>
                <Text style={[styles.cellSpace, styles.headerText, {flex: 2, textAlign: 'center'}]}>No. of Question</Text>
                <Text style={[styles.cellSpace, styles.headerText, {flex: 2, textAlign: 'center'}]}>Duration (min)</Text>
                <Text style={[styles.cellSpace, styles.headerText, {flex: 1}]}></Text>
            </View>
            <View style={{backgroundColor: '#e1f1ff'}}>
                {topic.skills.map((skill, index) => (
                    <ControlTableRow setUpdate={setUpdate} key={index} skill={skill}></ControlTableRow>
                ))}
            </View>
            <View style={{backgroundColor: '#e1f1ff', borderBottomRightRadius: 7, borderBottomLeftRadius: 7}}>
                <TouchableOpacity style={styles.addSkillBtn} onPress={() => {setModalType("add"), setModalVisible(true)}}>
                    <Text style={styles.addSkillBtnText}>Add Skill</Text>
                </TouchableOpacity>
            </View>
            <ControlSkillEditAddModal isVisible={modalVisible} setModalVisible={setModalVisible} update={setUpdate} modalType={modalType} topic={topic}></ControlSkillEditAddModal>
        </View>
    );
};

const styles = StyleSheet.create({
    topicTable: {
    },
    centerText: {
        justifyContent: 'center'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        flex: 12
    },
    cellSpace: {
        margin: 10,
        alignSelf: 'center'
    },
    headerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    },
    addSkillBtn: {
        backgroundColor: '#6696ca', 
        alignSelf: 'center',
        margin: 15, 
        borderRadius: 7
    },
    addSkillBtnText: {
        color: 'white', 
        paddingVertical: 10, 
        paddingHorizontal: 30, 
        fontSize: 20,
        fontWeight: 'bold'
    }
});
