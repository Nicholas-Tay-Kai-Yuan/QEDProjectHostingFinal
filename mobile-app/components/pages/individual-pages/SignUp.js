import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-native";
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import { Entypo, FontAwesome5, Feather } from '@expo/vector-icons';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { CheckBox, Icon } from 'react-native-elements';
// import * as ImagePicker from 'expo-image-picker';

// import bcrypt from '../node_modules/bcrypt';
import BcryptReactNative from 'bcrypt-react-native';
import {
    Button,
    FormControlLabel,
    FormControl,
    ScrollView,
    TextInput,
    Image,
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView
} from "react-native";
import signup from "../../../axios/user-api/signup";
import getSchool from "../../../axios/user-api/getSchool";

const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const role = [
        { label: 'Parent', value: 'parent' },
        { label: 'Teacher', value: 'teacher' },
        { label: 'Student', value: 'student' },
    ];
    const grade = [
        { label: 'Primary 1', value: 1 },
        { label: 'Primary 2', value: 2 },
        { label: 'Primary 3', value: 3 },
        { label: 'Primary 4', value: 4 },
        { label: 'Primary 5', value: 5 },
        { label: 'Primary 6', value: 6 },
    ];
    // const school = [
        
    // ]
    const genderButtons = [
        { label: 'M', value: 'M' },
        { label: 'F', value: 'F' },
    ];
    // const schoolOptions

    const [dropdownRole, setDropdownRole] = useState(null);
    const [dropdownGrade, setDropdownGrade] = useState(null);
    const [dropdownSchool, setDropdownSchool] = useState ([]);
    const [dropdownGradeText, setDropdownGradeText] = useState("");
    const [dropdownSchoolText, setDropdownSchoolText] = useState("");
    const [gender, setGender] = useState();
    const [isSelected, setSelection] = useState(false);
    
    let navigate = useNavigate();
    useEffect(() => {
        getSchool()
        .then((data) => {
            // console.log(data.data.result.records)
            for (let i = 0; i < data.data.result.records.length; i++){
                let array = dropdownSchool;
                array.push({label: data.data.result.records[i].school_name, value: data.data.result.records[i].school_name})
                setDropdownSchool(array)
                
            }
        })
    },[])
    // const salt = await BcryptReactNative.getSalt(10);
    // const bcrypt = require('bcrypt');
    // const saltRounds = 10;
    return (
        <ScrollView style={styles.wholeContainer}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <Image
                    style={styles.image}
                    source={require("../../../assets/Psleonline_logo_with_background.jpg")}
                ></Image>
                <Text style={styles.text}>Sign Up</Text>
                <View style={styles.nameContainer} behavior="padding">
                    <TextInput
                        style={styles.firstName}
                        placeholder="First Name"
                        onChangeText={(e) => setFirstName(e)}
                        value={firstName}
                    />
                    <TextInput
                        style={styles.lastName}
                        placeholder="Last Name"
                        onChangeText={(e) => setLastName(e)}
                        value={lastName}
                    />
                </View>
                <RadioForm
                    style={styles.radioButtonContainer}
                    formHorizontal={true}
                    animation={true}
                    radio_props={genderButtons}
                    initial={null}
                    onPress={(value) => setGender(value)}
                    buttonSize={13}
                    labelStyle={{ fontSize: 13, color: 'white', marginRight: 10, }}
                />
                <View style={styles.dropdown}>
                    <Dropdown
                        containerStyle={styles.shadow}
                        data={role}
                        labelField="label"
                        valueField="value"
                        label="Dropdown"
                        placeholder="Select"
                        value={dropdownRole}
                        onChange={item => {
                            setDropdownRole(item.value)
                            if (item.value == "student") {
                                setDropdownGrade(
                                    <View style={styles.dropdown}>
                                        <Dropdown
                                            containerStyle={styles.shadow}
                                            data={grade}
                                            labelField="label"
                                            valueField="value"
                                            label="Dropdown"
                                            placeholder="Select"
                                            value={dropdownGradeText}
                                            onChange={item => {
                                                setDropdownGradeText(item.value)
                                            }} />
                                    </View>
                                )
                                setDropdownSchool(
                                    <View style={styles.dropdown}>
                                        <Dropdown
                                            containerStyle={styles.shadow}
                                            data={dropdownSchool}
                                            labelField="label"
                                            valueField="value"
                                            label="Dropdown"
                                            placeholder="Select"
                                            value={dropdownSchoolText}
                                            onChange={item => {
                                                setDropdownSchoolText(item.value)
                                            }} />
                                    </View>
                                )
                            } else {
                                setDropdownGrade()
                                setDropdownSchool()
                            }
                        }} />
                </View>
                {dropdownGrade}
                {dropdownSchool}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={(e) => setEmail(e)}
                    value={email}
                />
                <View style={styles.passwordContainer} behavior="padding">
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        onChangeText={(e) => setPassword(e)}
                        value={password}
                    />
                    <View>
                        <FontAwesome5
                            name="eye"
                            style={styles.eyeIcon}
                            onPress={() => {
                                // setEye(isClose)
                                // { isClose ? "eye" : "eye slash" }
                            }} />
                    </View>
                </View>
                <View style={styles.passwordContainer} behavior="padding">
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirm Password"
                        onChangeText={(e) => setConfirmPassword(e)}
                        value={confirmPassword}
                    />
                    <View>
                        <FontAwesome5
                            name="eye"
                            style={styles.eyeIcon}
                            onPress={() => {
                                const { enteredPassword } = password
                                // const hash = await BcryptReactNative.hash(salt, 'password');
                                // return(hash)
                                // bcrypt.genSalt(saltRounds, function(err, salt) {
                                //     bcrypt.hash(enteredPassword, salt, function(err, hash) {
                                //         // Store hash in your password DB.
                                //     });
                                // });
                                // bcrypt.hash(enteredPassword, saltRounds, function(err, hash){})
                            }} />
                    </View>
                </View>
                <View style={styles.tncContainer}>
                    <View style={styles.checkboxContainer} behavior="padding">
                        <View style={styles.checkbox}>
                            <CheckBox
                                checked={isSelected}
                                onPress={() => setSelection(!isSelected)}
                                size={20}
                            />
                        </View>
                        <Text style={styles.terms}>I agree with QEDed's </Text>
                    </View>
                    <View style={styles.linkContainer}>
                        <Text
                            style={styles.link}
                            onPress={() => { navigate("/login") }}
                        >Terms of Serivce and Privacy Policy</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Sign Up"
                        onPress={() => {
                            let data;
                            if(dropdownRole == 'student'){
                                data = {
                                    first_name: firstName,
                                    last_name: lastName,
                                    gender: gender,
                                    email: email,
                                    password: password,
                                    role: dropdownRole,
                                    grade: dropdownGradeText,
                                    school: dropdownSchoolText,
                                }
                            }
                            else{
                                data = {
                                    first_name: firstName,
                                    last_name: lastName,
                                    gender: gender,
                                    email: email,
                                    password: password,
                                    role: dropdownRole,    
                                }
                            }
                            signup(data)
                                .then((res) => {
                                    navigate("/login")
                                    console.log(res)
                                })
                                .catch((e) => {
                                    console.log(e)
                                });
                        }}
                    />
                </View>
                <View style={styles.line} />
                <View style={styles.footerContainer} behavior="padding">
                    <Text
                        style={styles.footerText1}>
                        Already have an account?
                    </Text>
                    <Text
                        style={styles.footerText2}
                        onPress={() => { navigate("/Login") }}>
                        Log in
                    </Text>
                </View>

            </KeyboardAvoidingView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    wholeContainer: {
        flex: 1,
        backgroundColor: '#003744',
    },
    container: {
        alignItems: 'center',
    },
    nameContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    text: {
        flex: 0,
        color: 'white',
        fontSize: 25,
        height: 35,
    },
    image: {
        width: 550,
        height: 220,
        resizeMode: 'contain',
        top: 10
    },
    firstName: {
        justifyContent: 'flex-start',
        borderRadius: 30,
        backgroundColor: 'white',
        width: 300,
        height: 40,
        padding: 10,
        marginRight: 10,
    },
    lastName: {
        justifyContent: 'flex-end',
        borderRadius: 30,
        backgroundColor: 'white',
        width: 300,
        height: 40,
        padding: 10,
    },
    radioButtonContainer: {
        marginTop: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        textAlign: 'left',
        width: 610,
    },
    dropdown: {
        width: 610,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 30,
        backgroundColor: 'white',
        marginTop: 10,
        paddingLeft: 10,
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    input: {
        borderRadius: 30,
        backgroundColor: 'white',
        width: 610,
        height: 40,
        marginTop: 10,
        padding: 10,
    },
    passwordContainer: {
        flexDirection: 'row',
    },
    passwordInput: {
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        backgroundColor: "white",
        width: 565,
        height: 40,
        marginTop: 10,
        padding: 10,
    },
    eyeIcon: {
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        fontSize: 20,
        textAlign: 'center',
        backgroundColor: "white",
        height: 40,
        width: 45,
        marginTop: 10,
        padding: 10,
    },
    buttonContainer: {
        width: 610,
        marginTop: 10,
        marginRight: 40,
        marginLeft: 40,
        backgroundColor: 'white',
        borderRadius: 30,
        borderWidth: 1,
        overflow: 'hidden',
    },
    line: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        alignSelf: 'center',
        width: 610,
        marginTop: 15,
    },
    footerContainer: {
        flexDirection: 'row',
        marginTop: 15,
    },
    footerText1: {
        justifyContent: 'flex-end',
        color: 'white',
        width: 360,
        textAlign: 'right',
        paddingRight: 2,
    },
    footerText2: {
        justifyContent: 'flex-start',
        color: 'skyblue',
        width: 250,
        paddingLeft: 2,
        textDecorationLine: 'underline',
        // borderColor: 'white',
        // borderWidth: 1,
    },

    passwordContainer: {
        flexDirection: 'row',
    },
    tncContainer: {
        flexDirection: 'row',
    },
    checkbox: {
        justifyContent: 'center',
        right: 18,
    },
    terms: {
        color: 'white',
        fontSize: 16,
        right: 32,
    },
    link: {
        flex: 0,
        color: '#0d6efd',
        textDecorationLine: "underline",
        textAlign: 'left',
        fontSize: 16,
        width: 300,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    checkboxContainer: {
        width: 180,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        textAlign: 'left',
    },
    linkContainer: {
        width: 425,
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

})

export default SignUp;