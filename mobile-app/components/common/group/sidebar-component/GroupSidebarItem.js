import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigate } from "react-router-native";

const GroupSidebarItem = ({setItem, groupId, groupName, groupImg}) => {

    const [content, setContent] = useState();
    let navigate = useNavigate();

    useEffect(() => {
        setContent();
        let data = null;
        let itemCount = 6;
    
        for (let i = 0; i < itemCount; i++) {
            let fontAwesomeIcon = null;
            let itemName = null;
            let navigateTo = null;
            switch (i) {
                case 0:
                    fontAwesomeIcon = "bullhorn";
                    itemName = " Announcements";
                    navigateTo = "/group_announcement"
                    break;
                case 1:
                    fontAwesomeIcon = "clipboard";
                    itemName = " Group Assignments";
                    navigateTo = "/group_assignment"
                    break;
                case 2:
                    fontAwesomeIcon = "question";
                    itemName = " Ask a Question";
                    navigateTo = "/groupqna"
                    break;
                case 3:
                    fontAwesomeIcon = "users";
                    itemName = " Members";
                    navigateTo = "/group_members"
                    break;
                case 4:
                    fontAwesomeIcon = "award";
                    itemName = " Group Leaderboard";
                    navigateTo = "/group_leaderboard"
                    break;
                case 5:
                    fontAwesomeIcon = "chart-bar";
                    itemName = " Progress";
                    navigateTo = "/group_progress"
                    break;
            }
            if (i == setItem) {
                setContent(prevState => [prevState,  
                <TouchableOpacity onPress={() => navigate(navigateTo, {state: {groupId: groupId, groupName: groupName}})}>
                    <LinearGradient colors={['#6A3093', '#A044FF']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.itemContainer}>
                        <View style={styles.itemIcon}>
                            <FontAwesome5 name={fontAwesomeIcon} size={24} color="white" />
                        </View>
                        <View>
                            <Text style={[styles.text, {color: 'white'}]}>{itemName}</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
                ])
            }
            else {
                setContent(prevState => [prevState,
                <TouchableOpacity style={styles.itemContainer} onPress={() => navigate(navigateTo, {state: {groupId: groupId, groupName: groupName, groupImg: groupImg}})}>
                    <View style={styles.itemIcon}>
                        <FontAwesome5 name={fontAwesomeIcon} size={24} color="#AF7CF1" />
                    </View>
                    <View>
                        <Text style={styles.text}>{itemName}</Text>
                    </View>
                </TouchableOpacity>])     
            }
        }

    }, []);

    return (
        <View>
            {content}
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 25,
        paddingRight: 10,
        color: '#AF7CF1'
    },
    itemContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    itemIcon: {
        width: 30,
        alignItems: 'center',
        alignSelf: 'center',
    },
})


export default GroupSidebarItem;