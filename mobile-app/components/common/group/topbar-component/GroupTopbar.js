import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons'
import GroupSidebar from "../sidebar-component/GroupSidebar";

const GroupTopbar = ({item, heading, groupId, groupName, groupImg}) => {

    const [showSidebar, setSidebar] = useState();
    const [image, setImage] = useState();

    useEffect(() => {
        displayPic(groupImg)
    }, [])

    function displayPic(data) {
        if (data == undefined) {
            setImage(
            <Image
                style={styles.groupImg}
                source={require("../../../../assets/sample_groupimg.png")}>
            </Image>
            )
        }
        else {
            setImage(
            <Image
                style={styles.groupImg}
                source={{uri: data}}>
            </Image>
            )
        }
    }

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    {image}
                    <Text style={styles.itemHeading}>{heading}</Text>
                </View>
                <TouchableOpacity style={styles.menu} onPress={() => setSidebar(<GroupSidebar setSidebar={setSidebar} item={item} groupId={groupId} groupName={groupName} groupImg={groupImg}></GroupSidebar>)}>
                    <FontAwesome5 name="bars" size={24} color="black" />
                </TouchableOpacity>
            </View>
            {showSidebar}
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#F2F2F2',
        paddingVertical: 10,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1
    },
    groupImg: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    itemHeading: {
        fontSize: 30,
        fontWeight: '700',
        marginLeft: 10,
        textAlignVertical: 'center'
        // fontFamily: "PoppinsRegular"
    },
    leftContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    menu: {
        alignSelf: 'center',
    }
})

export default GroupTopbar;