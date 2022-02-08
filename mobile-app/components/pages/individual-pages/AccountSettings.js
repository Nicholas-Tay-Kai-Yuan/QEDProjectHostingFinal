import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from '@expo/vector-icons';
import RadioForm from 'react-native-simple-radio-button';
import { Dropdown } from 'react-native-element-dropdown';
import { CheckBox } from 'react-native-elements';
import Modal from "react-native-modal";
import updateProfileImage from "../../../axios/user-api/updateProfileImage";
import updateProfile from "../../../axios/user-api/updateProfile";
import Spinner from 'react-native-loading-spinner-overlay';
import Topbar from "../../common/top-navigations/Topbar"
import {
    TextInput,
    Image,
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
} from "react-native";
import logout from "../../../axios/user-api/logout";
import Sidebar from "../../common/side-navigations/Sidebar";
import * as ImagePicker from 'expo-image-picker';
import AccountButton from "../../account-settings-components/AccountButton";
import AccountDropdown from "../../account-settings-components/AccountDropdown";
import AccountHeader from "../../account-settings-components/AccountHeader";

// import { styles } from "react-native-element-dropdown/src/TextInput/styles";
const genderButtons = [
    { label: 'M', value: 0 },
    { label: 'F', value: 1 },
];
const grade = [
    { label: 'Primary 1', value: 1 },
    { label: 'Primary 2', value: 2 },
    { label: 'Primary 3', value: 3 },
    { label: 'Primary 4', value: 4 },
    { label: 'Primary 5', value: 5 },
    { label: 'Primary 6', value: 6 },
];

const AccountSettings = () => {
    const [isSelected, setSelection] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [gender, setGender] = useState();
    const [radio, setRadio] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    // const [dropdownSchoolData, setDropdownSchoolData] = useState([]);
    const [dropdownSchool, setDropdownSchool] = useState();
    const [dropdownGrade, setDropdownGrade] = useState(null);
    const [dropdownGradeText, setDropdownGradeText] = useState("");
    const [dropdownSchoolText, setDropdownSchoolText] = useState("");
    const [imageURI, setImageURI] = useState(null);
    const [image, setImage] = useState();
    const [exp, setExp] = useState();
    const [isReady, setReady] = useState(true);
    const [isStudent, setIsStudent] = useState(false);
    let navigate = useNavigate();

    const getUserData = async () => {
        const data = await AsyncStorage.getItem("userInfo");
        return JSON.parse(data)
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImageURI(result.uri);
            setImage(<Image style={styles.groupImg} source={{ uri: result.uri }}></Image>);
        }
    };

    useEffect(() => {
        // getSchool()
        //     .then((data) => {
        //         for (let i = 0; i < data.data.result.records.length; i++) {
        //             let array = dropdownSchoolData;
        //             array.push({ label: data.data.result.records[i].school_name, value: data.data.result.records[i].school_name })
        //             setDropdownSchoolData(array)
        //         }
        getUserData()
            .then((data) => {
                setFirstName(data.first_name)
                setLastName(data.last_name)
                setName(<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 25 }}><Text style={styles.name}>{data.first_name} {data.last_name}</Text><FontAwesome5
                    name="edit"
                    style={styles.editIcon}
                    onPress={() => setModalVisible(true)}>
                </FontAwesome5></View>)
                setEmail(<Text style={styles.email}>{data.email}</Text>)

                if (data.pfp != undefined) {
                    setImage(
                        <Image style={styles.groupImg} source={{ uri: data.pfp }}></Image>
                    )
                }

                if (data.gender == 'M') {
                    setGender(0)
                    setRadio(
                        <RadioForm
                            style={styles.radioButtonContainer}
                            formHorizontal={true}
                            animation={true}
                            radio_props={genderButtons}
                            initial={0}
                            onPress={(value) => setGender(value)}
                            buttonSize={13}
                            labelStyle={{ fontSize: 15, color: 'black', marginRight: 20, }}
                        />

                    )
                }
                else {
                    setGender(1)
                    setRadio(
                        <RadioForm
                            style={styles.radioButtonContainer}
                            formHorizontal={true}
                            animation={true}
                            radio_props={genderButtons}
                            initial={1}
                            onPress={(value) => setGender(value)}
                            buttonSize={13}
                            labelStyle={{ fontSize: 15, color: 'black', marginRight: 20, }}
                        />

                    )
                }

                if (data.role === "student") {
                    let currentExp = data.exp_points / 100 * 610;

                    setExp(
                        <View style={{ alignItems: 'center', marginVertical: 25 }}>
                            <Text>Lv{data.rank_level}</Text>
                            <View style={styles.expBar}>
                                <View style={[styles.currentExp, { width: currentExp }]}></View>
                            </View>
                            <Text>EXP: {data.exp_points}/100</Text>
                        </View>

                    )

                    setDropdownGradeText(data.grade)
                    setDropdownSchoolText(data.school);
                }
            })
            .finally(() => {
                setIsStudent(true)
                setReady(false);
            })

        // })
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <Spinner visible={isReady} textContent="Loading..."></Spinner>
            <Sidebar></Sidebar>
            <ScrollView>
                <View style={styles.topbar}>
                    <Topbar navigate={navigate} />
                </View>
                <Text style={styles.title}>Profile</Text>
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                    <FontAwesome5 name="camera" style={{ zIndex: 100, opacity: 0.8 }} size={50} color="#b3b3b3" />
                    {image}
                </TouchableOpacity>
                <View>
                    <Modal isVisible={modalVisible2}>
                        <View style={styles.modalContainer} behavior="padding">
                            <View style={{ alignSelf: 'flex-start' }}>
                                <Text style={styles.modalHeader}>Updated!</Text>
                                <Text style={styles.modalText}>Profile successfully updated! Image might take a few seconds to upload</Text>
                            </View>
                            <View style={{ justifyContent: 'flex-end' }}>
                                <TouchableHighlight style={styles.okText} onPress={() => { setModalVisible2(false) }}>
                                    <Text>OK</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>
                </View>

                <View style={styles.nameContainer} behavior="padding">
                    {name}
                    <View>
                        <Modal isVisible={modalVisible}>
                            <View style={styles.modalContainer} behavior="padding">
                                <View style={{ alignSelf: 'flex-start' }}>
                                    <Text style={styles.modalHeader}>Edit Name</Text>
                                </View>
                                <TouchableOpacity style={{ width: 740, alignSelf: 'flex-end', alignItems: 'center' }} onPress={() => { setModalVisible(false) }}>
                                    <FontAwesome5 name="times" size={30} color='black' />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalContainer2} behavior="padding">
                                <TextInput
                                    style={styles.firstName}
                                    initial={firstName}
                                    onChangeText={(e) => setFirstName(e)}
                                    value={firstName}
                                />
                                <TextInput
                                    style={styles.lastName}
                                    initial={lastName}
                                    onChangeText={(e) => setLastName(e)}
                                    value={lastName}
                                />
                            </View>
                            <View style={styles.modalContainer3} behavior="padding">
                                <TouchableOpacity style={styles.editBtn} onPress={() => {
                                    setName(
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 25 }}>
                                            <Text style={styles.name}>{firstName} {lastName}</Text>
                                            <FontAwesome5
                                                name="edit"
                                                style={styles.editIcon}
                                                onPress={() => setModalVisible(true)}>
                                            </FontAwesome5>
                                        </View>);

                                    setModalVisible(false);
                                }}>
                                    <Text style={styles.editBtnText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>

                    </View>
                </View>
                {email}
                {exp}
                <Text style={styles.genderTitle}>Gender</Text>
                {radio}
                {/* <View style={{ alignItems: 'center' }}>
                    {dropdownGrade}
                    {dropdownSchool}
                </View> */}
                {isStudent ?
                    <AccountDropdown
                        currentGrade={dropdownGradeText}
                        currentSchool={dropdownSchoolText}
                        setGrade={setDropdownGradeText}
                        setSchool={setDropdownSchoolText}>
                    </AccountDropdown>
                    : <View></View>
                }
                <AccountButton
                    isMultipleButtons={false}
                    image={image}
                    firstName={firstName}
                    lastName={lastName}
                    imageURI={imageURI}
                    gender={gender}
                    dropdownGradeText={dropdownGradeText}
                    dropdownSchoolText={dropdownSchoolText}
                    setModalVisible2={setModalVisible2}></AccountButton>
                <AccountHeader isHeader={true}></AccountHeader>
                <View style={styles.tncContainer}>
                    <View style={styles.checkboxContainer} behavior="padding">
                        <Text style={styles.checkboxText}>Allow Email Notifications</Text>
                        <View style={styles.checkbox}>
                            <CheckBox
                                checked={isSelected}
                                onPress={() => setSelection(!isSelected)}
                                size={22}
                            />
                        </View>
                    </View>
                </View>
                <AccountHeader isHeader={false}></AccountHeader>
                <AccountButton isMultipleButtons={true}></AccountButton>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 35,
        marginTop: 40,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    name: {
        fontSize: 25,
    },
    editIcon: {
        fontSize: 20,
        marginLeft: 12,
    },
    modalHeader: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    modalContainer: {
        display: 'flex',
        backgroundColor: "white",
        width: '50%',
        alignSelf: 'center',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        padding: 30,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#D8D0CE'
    },
    modalContainer2: {
        display: 'flex',
        backgroundColor: "white",
        width: '50%',
        alignSelf: 'center',
        padding: 30,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#D8D0CE'
    },
    modalContainer3: {
        display: 'flex',
        backgroundColor: "white",
        width: '50%',
        alignSelf: 'center',
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        padding: 30,
        flexDirection: 'row',
    },
    modalText:{
        marginTop: 10,
        fontSize: 15,
    },
    okText:{
        width: 40,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EAE0E7',
        borderRadius: 7,
        marginLeft: 20,
        fontSize: 15,
    },
    firstName: {
        justifyContent: 'flex-start',
        borderRadius: 5,
        backgroundColor: 'white',
        width: 250,
        height: 40,
        padding: 10,
        marginRight: 15,
        borderColor: '#D8D0CE',
        borderWidth: 1,
    },
    lastName: {
        justifyContent: 'flex-end',
        borderRadius: 5,
        backgroundColor: 'white',
        width: 250,
        height: 40,
        padding: 10,
        borderColor: '#D8D0CE',
        borderWidth: 1,
    },
    editBtn: {
        backgroundColor: '#83CFFF',
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 7,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 10
        },
        elevation: 8,
        shadowRadius: 100,
        shadowOpacity: 1,
        marginBottom: 20
    },
    editBtnText: {
        color: 'white',
        fontSize: 20
    },
    email: {
        marginTop: 5,
        fontSize: 15,
        textAlign: 'center',
    },
    genderTitle: {
        fontSize: 22,
        textAlign: 'center',
    },
    radioButtonContainer: {
        marginTop: 10,
        marginLeft: 40,
        alignSelf: 'center'
    },
    buttonContainer: {
        width: 350,
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 30,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    tncContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    checkbox: {
        right: 25,
        alignSelf: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 1,
    },
    checkboxText: {
        color: 'black',
        fontSize: 16,
        right: 16,
    },
    checkboxContainer: {
        width: 180,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    dropdown: {
        width: 610,
        borderWidth: 1,
        borderColor: '#8cb0d7',
        borderRadius: 15,
        backgroundColor: '#e1f1ff',
        marginTop: 10,
        paddingLeft: 10,
    },
    imagePicker: {
        alignSelf: 'center',
        borderRadius: 250,
        width: 250,
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#b3b3b3",
    },
    groupImg: {
        width: 250,
        height: 250,
        position: 'absolute',
        borderRadius: 250,
        zIndex: 1
    },
    expBar: {
        backgroundColor: '#B1DBFF',
        borderRadius: 90,
        height: 15,
        width: 610
    },
    currentExp: {
        backgroundColor: '#3DB3FF',
        borderRadius: 90,
        height: 15,
    }
})
export default AccountSettings;