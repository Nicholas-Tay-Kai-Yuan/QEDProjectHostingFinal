import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Image, Text, ScrollView, TouchableOpacity, SectionList } from "react-native";
import { useLocation, useSearchParams } from "react-router-native";
import GroupTopbar from "../../common/group/topbar-component/GroupTopbar";
import SideBar from "../../common/side-navigations/Sidebar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getGroupById from "../../../axios/group-api/getGroupById";
import GroupSentMessage from "../../group-components/announcement/GroupSentMessage";
import GroupReceivedMessage from "../../group-components/announcement/GroupReceivedMessage";
import Spinner from 'react-native-loading-spinner-overlay';
import { FontAwesome5 } from '@expo/vector-icons';
import Topbar from "../../common/top-navigations/Topbar"
import { useNavigate } from "react-router-native";

export default GroupAnnouncement = () => {
    const { state } = useLocation();
    const [msg, setMsg] = useState("")
    const [allMsg, setAllMsg] = useState();
    const [userId, setUserId] = useState();
    const [userName, setUserName] = useState();
    const [socket, setSocket] = useState();
    const navigate = useNavigate();
    const getUserData = async () => {
        const data = await AsyncStorage.getItem("userInfo");
        return JSON.parse(data)
    };
    const [isReady, setReady] = useState(true);
    const [centerEmptyAnnouncement, setEmpty] = useState({ flexGrow: 1, justifyContent: 'center' });

    let websocket;

    function initWebSocket(userId) {
        let countReconn = 0;
        // Create WebSocket connection.
        let ws = new WebSocket('ws://10.0.2.2:3000');
        // Connection opened
        let socket = websocket;

        ws.onopen = function (event) {
            let data = {
                action: "join",
                group_id: state.groupId,
                user_id: userId
            }
            websocket.send(JSON.stringify(data));
            console.log("Sent request to join group", data);
            countReconn = 0;
        };

        ws.onerror = function (event) {
            console.log("Socket Connection Error");
            console.log(event)
            ws.close();
        };

        // Listen for messages
        ws.onmessage = function (event) {
            console.log('Message from server:', event.data);
            let message = JSON.parse(event.data);
            switch (message.action) {
                case "message": {
                    console.log("Message received", message);

                    let post = {
                        sender_name: message.sender_name,
                        content: message.post.content,
                        created_at: message.post.created_at
                    }

                    if (message.post.made_by != userId) {
                        displayOtherMsg(post);
                    }
                    else {
                        displayOwnMsg(post);
                    }

                    break;
                }
            }
        };

        // Handle Connection Close
        ws.onclose = function (event) {
            console.log("Connection closed, reconnecting..");

            if (countReconn > 3) {
                // alert("Could not connect after"+ countReconn+ "tries");
                // document.querySelector("#input-msg").disabled = true;
                // document.querySelector("#conn-err").style.display = "block";

                let data = {
                    action: "leave",
                    group_id: state.groupId,
                    user_id: userId
                }
                socket.send(JSON.stringify(data));
            }
            else {
                setTimeout(function () {
                    countReconn++;
                    websocket = initWebSocket(userId)
                }, 6000);
            }
        };
        setSocket(ws);
        return ws;
    }

    useEffect(() => {
        getUserData()
            .then((data) => {
                websocket = initWebSocket(data._id);
                setUserId(data._id);
                setUserName(data.first_name + " " + data.last_name)
                getGroupById(state.groupId)
                    .then((result) => {
                        let tempDate;

                        for (let i = 0; i < result.posts.length; i++) {
                            if (result.posts[0].created_at == undefined) {
                                setEmpty({ flexGrow: 1, justifyContent: 'center' });
                                setAllMsg(<View style={{ alignSelf: 'center' }}><FontAwesome5 style={styles.announcementEmpty} name="bullhorn" size={100}></FontAwesome5><Text style={{ textAlign: 'center', fontSize: 20 }}>No Announcements</Text></View>)
                            }
                            else {
                                setEmpty();
                                let newDate = new Date(result.posts[i].created_at);
                                if (tempDate == undefined || differentDay(tempDate, newDate)) {
                                    setAllMsg(prevState => [prevState, <Text style={styles.date}>{newDate.getDate()} {getMonth(newDate.getMonth())}</Text>]);
                                }
                                tempDate = newDate;
                                if (result.posts[i].made_by == data._id) {
                                    displayOwnMsg(result.posts[i]);
                                }
                                else {
                                    displayOtherMsg(result.posts[i]);
                                }
                            }
                        }
                    })
                    .finally(() => {
                        setReady(false);
                    })
            });

    }, [])

    function displayOwnMsg(post) {
        setAllMsg(prevState => [prevState, <GroupSentMessage post={post}></GroupSentMessage>])
    }

    function displayOtherMsg(post) {
        setAllMsg(prevState => [prevState, <GroupReceivedMessage post={post}></GroupReceivedMessage>])
    }

    function differentDay(d1, d2) {
        return d1.getDate() !== d2.getDate() ||
            d1.getMonth() !== d2.getMonth() ||
            d1.getFullYear() !== d2.getFullYear();
    }

    function getMonth(month) {
        let monthLong;

        switch (month) {
            case 1:
                monthLong = "January";
                break;
            case 2:
                monthLong = "Feburary";
                break;
            case 3:
                monthLong = "March";
                break;
            case 4:
                monthLong = "April";
                break;
            case 5:
                monthLong = "May";
                break;
            case 6:
                monthLong = "June";
                break;
            case 7:
                monthLong = "July";
                break;
            case 8:
                monthLong = "August";
                break;
            case 9:
                monthLong = "September";
                break;
            case 10:
                monthLong = "October";
                break;
            case 11:
                monthLong = "November";
                break;
            case 12:
                monthLong = "December";
                break;
        }

        return monthLong;
    }

    function sendMsg() {
        let date = new Date();

        if (msg != "") {
            let data = {
                action: "message",
                sender_name: userName,
                group_id: state.groupId,
                post: {
                    made_by: userId,
                    content: msg,
                    created_at: date.toISOString()
                }
            };

            socket.send(JSON.stringify(data));
            setMsg("");
        }

    }

    function deleteAnnouncement(postId) {
        let data = {
            action: "delete message",
            postId: postId,
            group_id: state.groupId
        };
        socket.send(JSON.stringify(data));
    }

    return (
        <View style={styles.container}>
            <Spinner visible={isReady} textContent="Loading..."></Spinner>
            <SideBar currentPage="My Groups"></SideBar>
            <View style={styles.announcementContainer}>
                <View style={styles.topbar}>
                    <Topbar navigate={navigate} />
                </View>
                <GroupTopbar item={0} heading={"Announcements"} groupId={state.groupId} groupName={state.groupName} groupImg={state.groupImg}></GroupTopbar>
                <ScrollView
                    contentContainerStyle={centerEmptyAnnouncement}
                    ref={ref => { this.scrollView = ref }}
                    onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}>
                    <View style={styles.msgContainer}>
                        {allMsg}
                    </View>
                </ScrollView>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Message here, Shift + Enter to go to new line"
                        onChangeText={(e) => setMsg(e)}
                        value={msg}
                    />
                    <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => sendMsg()}>
                        <Image
                            style={styles.sendBtn}
                            source={require("../../../assets/send.png")}
                        ></Image>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        zIndex: 1
    },
    topbar:{
        height: 60,
    },
    announcementContainer: {
        flex: 1
    },
    input: {
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        fontSize: 20,
        width: 700,
    },
    sendBtn: {
        width: 35,
        height: 35,
        marginLeft: 20,
        alignSelf: 'center'
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 20,
        backgroundColor: 'white'
    },
    msgContainer: {
        width: 750,
        alignSelf: 'center',
    },
    date: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 20
    },
    ownMsg: {
        padding: 10,
        backgroundColor: '#e1f1ff',
        alignSelf: 'flex-end',
        borderRadius: 12,
        borderBottomRightRadius: 0,
        paddingRight: 50,
        marginVertical: 10,
        marginRight: 40
    },
    announcementEmpty: {
        color: '#EF798A',
        textShadowColor: '#98c5ff',
        textShadowOffset: {
            width: 5, height: 5
        },
        textShadowRadius: 10,
        alignSelf: 'center'
    }
});