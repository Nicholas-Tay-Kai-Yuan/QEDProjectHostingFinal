import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-native";
import {
    Button,
    TextInput,
    Image,
    ImageBackground,
    View,
    Text,
    Switch,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableOpacity,
} from "react-native";

import resetPassword from "../../../axios/user-api/resetPassword";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [text, setText] = useState();
    const [formDisplay, setDisplay] = useState();

    useEffect(() => {
    }, [])

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ImageBackground
                style={styles.backgroundImage}
                source={require("../../../assets/bg5.png")}>
                <View style={styles.innerContainer}>
                    <Image
                        style={styles.innerImage}
                        source={require("../../../assets/Psleonline_logo_transparent.png")}>
                    </Image>
                    <View style={[styles.inputContainer, formDisplay]}>
                
                        <Text style={styles.text}>Please enter your new password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            onChangeText={(e) => setEmail(e)}
                            value={email}
                        >
                        </TextInput>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                resetPassword({
                                    email: email,
                                })
                                    .then((res) => {
                                        setDisplay({ display: 'none' })
                                        setText(<Text>Your password have been successfully updated!</Text>)
                                    })
                                    .catch((e) => {
                                        console.log(e)
                                    })
                            }}>

                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity >
                    </View>

                    {text}
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: "absolute",
    },
    innerContainer: {
        justifyContent: "center",
        alignItems: 'center',
    },
    innerImage: {
        width: 500,
        height: 180,
        resizeMode: "contain",
        marginTop: 100,
    },
    inputContainer: {
        borderColor: 'black',
        borderWidth: 1,
        width: 400,
        borderRadius: 15,
        alignItems: 'center',
        padding: 40,
    },
    text: {
        fontSize: 25,
        textAlign: 'center',
    },
    input: {
        borderRadius: 5,
        backgroundColor: "white",
        width: 280,
        height: 40,
        marginTop: 10,
        padding: 10,
        borderColor: 'black',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 30
    },
    button: {
        marginTop: 30,
        borderRadius: 5,
        borderColor: '#0d6efd',
        borderWidth: 1,
    },
    submitText: {
        textAlign: 'center',
        color: '#0d6efd',
        fontSize: 20,
        padding: 14,
    }
});

export default ResetPassword