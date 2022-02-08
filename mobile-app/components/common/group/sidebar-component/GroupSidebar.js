import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons'
import GroupSidebarItem from '../sidebar-component/GroupSidebarItem';

const GroupSidebar = ({setSidebar, item, groupId, groupName, groupImg}) => {

    const [image, setImage] = useState(<Image
        style={styles.groupImg}
        source={require("../../../../assets/sample_groupimg.png")}>
    </Image>);
    
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
        <View style={styles.container}>
            <View style={styles.upperContainer}>
                <TouchableOpacity style={{width: 30}} onPress={() => setSidebar()}>
                    <FontAwesome5 name="times" size={30} color="black" />
                </TouchableOpacity>
                <View>
                    {image}
                </View>
                <View>
                    <Text style={styles.groupName}> {groupName}</Text>
                </View>
                <View style={styles.line}></View>
            </View>
            <GroupSidebarItem setItem={item} groupId={groupId} groupName={groupName} groupImg={groupImg}></GroupSidebarItem>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: Dimensions.get('window').height,
        backgroundColor: '#E9E7FA',
        paddingVertical: 15,
        alignItems: 'flex-start',
        alignSelf: 'flex-end',
        elevation: 10,
        zIndex: 100
    },
    groupImg: {
        width: 150,
        height: 150,
        marginTop: 30,
        marginBottom: 17,
        borderRadius: 150
    },
    groupName: {
        fontSize: 30,
        fontWeight: '700'
    },
    line: {
        borderBottomColor: '#BE94F4',
        borderBottomWidth: 1,
        width: 260,
        marginTop: 30,
        marginBottom: 15,
    },
    upperContainer: {
        marginHorizontal: 20
    }
})

export default GroupSidebar;