import React, {useState, useEffect} from "react";
import { StyleSheet, Text, View, Image, Touchable } from "react-native";
import NotificationItem from "./NotificationItem";
import { FontAwesome5 } from '@expo/vector-icons'
import { ScrollView, TouchableOpacity} from 'react-native-gesture-handler'

export default NotificationContainer = ({closeOverlay}) => {

    const [notifications, setNotifications] = useState();

    useEffect(() => {
        getUserNotifications()
        .then(( data ) => {
            setNotifications();
            displayNotifications(data);
        });
    }, []);

    function displayNotifications(data) {
        for (let i = 0; i < data.length; i++) {
            setNotifications(prevState => 
                [
                    prevState,
                    <NotificationItem data={data[i]}></NotificationItem>
                ])
        }
    }

    return (
        <View style={styles.notificationOverlay}>
            <View style={{ backgroundColor: '#f1faff', padding: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontWeight: 'bold', fontSize: 25}}>Notification</Text>
                <TouchableOpacity style={{alignItems: 'center'}} onPress={() => closeOverlay()} >
                    <FontAwesome5 name="times" size={30} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{maxHeight: 400}}>
                <ScrollView style={{ backgroundColor: '#d4ebff'}}>
                    {notifications}
                </ScrollView>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    notificationOverlay: {
        position: 'absolute', 
        backgroundColor: 'white', 
        top: 70, 
        right: 20, 
        borderWidth: 1, 
        borderRadius: 5,
        width: 450,
        overflow: 'hidden',
        elevation: 10,
    },
});
