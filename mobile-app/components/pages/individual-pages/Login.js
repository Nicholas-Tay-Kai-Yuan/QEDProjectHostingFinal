import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-native";
import { Entypo, FontAwesome5, Feather } from '@expo/vector-icons';
import { CheckBox, Icon } from 'react-native-elements';
import {
    Button,
    TextInput,
    Image,
    View,
    Text,
    Switch,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    KeyboardAwareScrollView,
    TouchableOpacity,
} from "react-native";
import login from "../../../axios/user-api/login";
import rememberMe from "../../../axios/user-api/rememberMe";
import { getMediaLibraryPermissionsAsync } from "expo-image-picker";
// import { startCase } from "lodash";
// import math, { row } from "mathjs";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isSelected, setSelection] = useState(false);
    const [isClose, setEye] = useState(true);

    let navigate = useNavigate();

    useEffect(() => {
        // console.log("test")
        // rememberMe()
        //     .then(( token ) => {
        //         console.log("test token")
        //         console.log(token)
        //         if(token === "") navigate ("/login")
        //         else{
        //             const { role } = user;
        //             if(role === "admin") navigate ("/control");
        //             else navigate("/overview");
        //         }
        //     })
        //     .catch((e) => {
        //         console.log("test catch")
        //         // if (Array.isArray(e)) setErrorMsg(e.error[0]);
        //         // else setErrorMsg(e.error);
        //     });
    }, [])

    function handlePwdMask() {
        if (isClose) {
            setEye(false);
        }
        else {
            setEye(true);
        }
    }

    return (
        <ScrollView style={styles.wholeContainer}>
            <KeyboardAvoidingView style={styles.container} >
                <Image
                    style={styles.image}
                    source={require("../../../assets/Psleonline_logo_with_background.jpg")}
                ></Image>
                <Text style={styles.text}>Log In</Text>
                <Text style={styles.error}>{errorMsg}</Text>
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
                        secureTextEntry={isClose}
                        onChangeText={(e) => setPassword(e)}
                        value={password}>
                    </TextInput>
                    <TouchableOpacity onPress={() => handlePwdMask()}>
                        <FontAwesome5
                            name="eye"
                            style={styles.eyeIcon}/>
                    </TouchableOpacity>
                </View>
                {/* <View>
                <Switch
                    value={this.state.rememberMe}
                    onValueChange={(value) => this.toggleRememberMe(value)}>
                    <Text>Remember Me</Text>
                </Switch>
            </View> */}
                <View style={styles.rmbpwContainer}>
                    <View style={styles.rememberMeContainer} behavior="padding">
                        <View style={styles.checkbox}>
                            <CheckBox
                                checked={isSelected}
                                onPress={() => setSelection(!isSelected)}
                                size={20}
                            />
                        </View>
                        <Text style={styles.rememberMe}>Remember Me</Text>
                    </View>
                    <View style={styles.forgotPasswordContainer}>
                        <Text
                            style={styles.forgotPassword}
                            onPress={() => { navigate("/resetPassword") }}
                        >Forgot Password?</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer} behavior="padding">
                    <Button
                        title="Login"
                        onPress={() => {
                            login({
                                email: email,
                                password: password,
                                rememberMe: true,
                            })
                                .then(({ user }) => {
                                    const { role } = user;
                                    if (role === "admin") navigate("/control");
                                    else navigate("/overview");
                                })
                                .catch((e) => {
                                    if (Array.isArray(e)) setErrorMsg(e.error[0]);
                                    else setErrorMsg(e.error);
                                });
                        }}
                    />
                </View>
                <View style={styles.line} />
                <View style={styles.footerContainer} behavior="padding">
                    <Text
                        style={styles.footerText1}>
                        Don't have an account?
                    </Text>
                    <Text
                        style={styles.footerText2}
                        onPress={() => { navigate("/SignUp") }}>
                        Create a new one!
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    wholeContainer: {
        flex: 1,
        backgroundColor: "#003744",
    },
    container: {
        alignItems: "center",
    },
    text: {
        flex: 0,
        color: "white",
        fontSize: 25,
        height: 35,
        top: 15,
    },
    error: {
        color: "red",
        fontSize: 15,
        textAlign: "center",
        marginVertical: 30,
    },
    image: {
        width: 550,
        height: 220,
        resizeMode: "contain",
        marginTop: 100,
    },
    input: {
        borderRadius: 15,
        backgroundColor: "white",
        width: 560,
        height: 40,
        marginTop: 10,
        bottom: 25,
        padding: 10,
    },
    passwordInput: {
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        backgroundColor: "white",
        width: 515,
        height: 40,
        marginTop: 10,
        bottom: 25,
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
        bottom: 25,
        padding: 10,
    },
    buttonContainer: {
        width: 560,
        marginRight: 40,
        marginLeft: 40,
        backgroundColor: 'white',
        borderRadius: 30,
        borderWidth: 1,
        overflow: 'hidden',
        bottom: 15,
    },
    passwordContainer: {
        flexDirection: 'row',
    },
    rmbpwContainer: {
        flexDirection: 'row',
        bottom: 20
    },
    checkbox: {
        justifyContent: 'center',
        right: 18,
        // borderColor: 'white',
        // borderWidth: 1,
    },
    rememberMe: {
        color: 'white',
        fontSize: 16,
        right: 32,
    },
    forgotPassword: {
        flex: 0,
        color: '#0d6efd',
        textDecorationLine: "underline",
        textAlign: 'right',
        fontSize: 16,
        width: 130,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    rememberMeContainer: {
        width: 280,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        textAlign: 'left',
    },
    forgotPasswordContainer: {
        width: 280,
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    line: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        alignSelf: 'center',
        width: 560,
    },
    footerContainer: {
        flexDirection: 'row',
        marginTop: 15,
    },
    footerText1: {
        justifyContent: 'flex-end',
        color: 'white',
        width: 280,
        textAlign: 'right',
        paddingRight: 2,
    },
    footerText2: {
        justifyContent: 'flex-start',
        color: 'skyblue',
        width: 280,
        paddingLeft: 2,
        textDecorationLine: 'underline',
    }
});

export default Login;