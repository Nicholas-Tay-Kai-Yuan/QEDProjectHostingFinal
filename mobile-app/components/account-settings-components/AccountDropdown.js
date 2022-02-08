import React, { useState, useEffect } from "react";
import { Entypo, FontAwesome5, Feather } from '@expo/vector-icons';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';

import {
    Button,
    TextInput,
    Image,
    View,
    Text,
    Switch,
    ScrollView,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    KeyboardAvoidingView,
    KeyboardAwareScrollView,
} from "react-native";

const AccountDropdown = ({ currentGrade, currentSchool, setGrade, setSchool}) => {
    const [dropdownSchoolData, setDropdownSchoolData] = useState([]);
    const [needsUpdate, setUpdate] = useState(1)
    const [isReady, setIsReady] = useState(false)
    const grade = [
        { label: 'Primary 1', value: 1 },
        { label: 'Primary 2', value: 2 },
        { label: 'Primary 3', value: 3 },
        { label: 'Primary 4', value: 4 },
        { label: 'Primary 5', value: 5 },
        { label: 'Primary 6', value: 6 },
    ];

    useEffect(() => {
        getSchool()
            .then((data) => {
                for (let i = 0; i < data.data.result.records.length; i++) {
                    let array = dropdownSchoolData;
                    array.push({ label: data.data.result.records[i].school_name, value: data.data.result.records[i].school_name })
                    setDropdownSchoolData(array)
                }
            })
            .finally(() => {
                setUpdate(prevState => prevState +1)
                setIsReady(true);
            })

    }, [dropdownSchoolData])

    return (
        <View style={{ alignItems: 'center' }}>
            {/* {dropdownGrade}
            {dropdownSchool} */}
            <View style={styles.dropdown}>
                <Dropdown
                    containerStyle={styles.shadow}
                    data={grade}
                    labelField="label"
                    valueField="value"
                    label="Dropdown"
                    placeholder="Select"
                    value={currentGrade}
                    onChange={item => {
                        setGrade(item.value)
                    }} />
            </View>
            <View style={styles.dropdown}>
                <Dropdown
                    containerStyle={styles.shadow}
                    data={dropdownSchoolData}
                    labelField="label"
                    valueField="value"
                    label="Dropdown"
                    placeholder="Select"
                    value={isReady ? currentSchool : ""}
                    onChange={item => {
                        setSchool(item.value)
                    }} />
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    dropdown: {
        width: 610,
        borderWidth: 1,
        borderColor: '#8cb0d7',
        borderRadius: 15,
        backgroundColor: '#e1f1ff',
        marginTop: 10,
        paddingLeft: 10,
    },
})

export default AccountDropdown;