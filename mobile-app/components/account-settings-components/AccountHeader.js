
import React, { useState, useEffect } from "react";

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


const AccountHeader = ({ isHeader }) => {
    return (
        <View>
            {isHeader ?
                <Text style={styles.title}>Notifications</Text>
                :
                <Text style={styles.title}>Others</Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 35,
        marginTop: 40,
        textAlign: 'center',
        fontWeight: 'bold',
    },
})

export default AccountHeader;