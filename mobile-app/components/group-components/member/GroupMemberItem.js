import React, { useEffect, useState } from "react";
import { StyleSheet, Image } from "react-native";
import { List } from 'react-native-paper';

const GroupMemberItem = ({username, profileImg, isAdmin}) => {

    const [profile, setProfile] = useState();
    const [admin, setAdmin] = useState();

    function displayAdmin() {
        if (isAdmin) {
            setAdmin(
            <Image
                style={styles.admin}
                source={require("../../../assets/crown.png")}
            ></Image>)
        }
        else {
            setAdmin()
        }
    }

    function displayPic() {
        if (profileImg == null) {
            setProfile(
            <Image
                    style={styles.userIcon}
                    source={require("../../../assets/avatars/frog.png")}>
            </Image>
            );
        }
        else {
            setProfile(
            <Image
                style={styles.userIcon}
                source={{uri: profileImg}}>
            </Image>
            );
        }
    }

    return (
        <List.Item onLayout={() => {displayPic(), displayAdmin()}} title={username} titleStyle={styles.memberLabel}
        left={props => profile}
        right={props => admin} />    
    )
};

const styles = StyleSheet.create({
    userIcon: {
        marginLeft: 20,
        marginRight: 10,
        alignSelf: 'center',
        width: 30,
        height: 30,
        borderRadius: 30
    },
    memberLabel: {
        fontSize: 20
    },
    admin: {
        width: 25,
        height: 20,
        alignSelf: 'center'
    }
});

export default GroupMemberItem;