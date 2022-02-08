import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-native";

import updateProfileImage from "../../axios/user-api/updateProfileImage";
import updateProfile from "../../axios/user-api/updateProfile";

import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    Modal,
    TouchableOpacity,
} from "react-native";
import logout from "../../axios/user-api/logout";

const AccountButton = ({ isMultipleButtons, image, firstName, lastName, imageURI, gender, dropdownGradeText, dropdownSchoolText, setModalVisible2 }) => {
    let navigate = useNavigate();

    function editProfilePic() {

        let formData = new FormData();
        formData.append("image", { uri: imageURI, name: 'profileimg.jpg', type: 'image/jpeg' });

        updateProfileImage(formData)
            .then((data) => {
            })
    }

    function updateStudent() {

        let genderType;

        if (image != undefined) {
            editProfilePic();
        }

        if (gender == 0) {
            genderType = "M";
        } else {
            genderType = "F";
        }

        let data = {
            first_name: firstName,
            last_name: lastName,
            gender: genderType,
            school: dropdownSchoolText,
            grade: dropdownGradeText
        }

        updateProfile(data)
            .then((data) => {

            })
    }

    function updateUser() {
        let genderType;

        if (image != undefined) {
            editProfilePic();
        }

        if (gender == 0) {
            genderType = "M";
        } else {
            genderType = "F";
        }

        let data = {
            first_name: firstName,
            last_name: lastName,
            gender: genderType,
        }

        updateProfile(data)
            .then((data) => {

            })
    }

    return (
        <View>
            {isMultipleButtons ?
                <View>
                    <TouchableHighlight
                        style={styles.submit}
                        onPress={() => { navigate("/requestPasswordReset") }}
                        underlayColor='#fff'>
                        <Text style={styles.changePwd}>Change Password</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.submit}
                        onPress={() => {
                            logout()
                                .then(() => {
                                    navigate("/login")
                                })
                        }}
                        underlayColor='#fff'>
                        <Text style={styles.logoutBtn}>Logout</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.submit}
                        onPress={() => { }}
                        underlayColor='#fff'>
                        <Text style={styles.deleteBtn}>Delete Account</Text>
                    </TouchableHighlight>
                </View>
                :
                <TouchableHighlight
                    style={styles.submit}
                    underlayColor='#fff'>
                    <Text
                        style={styles.submitBtn}
                        onPress={() => {
                            setModalVisible2(true)
                            if (dropdownGradeText != "" && dropdownSchoolText != "") {
                                updateStudent();
                            }
                            else {
                                updateUser();
                            }
                        }
                        }
                    >Submit Changes</Text>
                </TouchableHighlight>

            }


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    submitBtn: {
        marginTop: 15,
        paddingTop: 12,
        paddingBottom: 12,
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        backgroundColor: '#83CFFF',
        borderRadius: 10,
        width: 350,
    },
    changePwd: {
        marginTop: 15,
        paddingTop: 12,
        paddingBottom: 12,
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        backgroundColor: '#83CFFF',
        borderRadius: 10,
        width: 350,
    },
    logoutBtn: {
        marginTop: 15,
        paddingTop: 12,
        paddingBottom: 12,
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        backgroundColor: '#FCC168',
        borderRadius: 10,
        width: 350,
    },
    deleteBtn: {
        marginTop: 15,
        paddingTop: 12,
        paddingBottom: 12,
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        backgroundColor: '#FB7D7D',
        borderRadius: 10,
        width: 350,
        marginBottom: 40
    },
    submit: {
        width: 350,
        alignSelf: 'center'
    },
    okText: {
        width: 40,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 7,
        marginLeft: 20,
    },
})

export default AccountButton;