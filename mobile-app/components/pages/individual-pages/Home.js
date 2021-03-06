import React, {useState} from "react";
import { Button, View, Text, StyleSheet, Image, Dimensions, ScrollView, TextInput, ImageBackground, FlatList} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigate } from "react-router-native";
import { Entypo } from '@expo/vector-icons';
import { Video } from 'expo-av';
import Carousel from 'react-native-snap-carousel';
import HomeAuthenticationButton from "../../home-components/HomeAuthenticationButton";
import HomeNavItem from "../../home-components/HomeNavItem";
import HomeGalleryItem from "../../home-components/HomeGalleryItem";


export default Home = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [images, setimages] = useState([
        require('../../../assets/banner1.jpg'),
        require('../../../assets/banner2.jpg'),
        require('../../../assets/banner3.jpg'),
      ]);
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Image style={styles.image} source={require('../../../assets/Psleonline_logo_transparent.png')}></Image>     
                        <HomeNavItem></HomeNavItem>
                        <HomeAuthenticationButton></HomeAuthenticationButton>        
                    </View>

                    {/* Carousel Images */}
                    <View style={styles.carousel}>
                        {/* <Image style={styles.bannerImage} source={require('../../../assets/banner1.jpg')}></Image>      */}
                        <FlatList
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false} 
                        data={images}
                        renderItem={ ({ item, index }) => (
                        <Image source={item} 
                            key={index} 
                            style={{
                            width: Dimensions.get('window').width,
                            resizeMode:'contain',
                            margin:8
                            }}
                        />
                        )}
                    />
                    </View>

                    {/* About Us */}
                    <View>
                        <ImageBackground source={require('../../../assets/conclusionbackgroundimage.jpg')} style={styles.aboutBackgroundImage}>
                            <Text style={styles.about}>About Us</Text>
                            <Text style={styles.aboutParagraph}>
                            PSLE Online uses Artificial Intelligence (A.I) technology to assist students in learning Mathematics and parents to monitor their children???s??? progress. 
                            Parents can assign homework generated by our in-house A.I algorithm to their children through the platform and monitor their child???s academic progress without
                            spending unnecessarily on assessment books that are eventually thrown away after one use. 
                            It also automates the time-consuming task of marking worksheets, providing students instantaneous feedback on their work.
                            {`\n\n`}
                            With many schools adopting a home-based approach to learning, subjects like Mathematics are challenging to teach without live-feedback from teachers. 
                            PSLE Online sees this as an opportunity to support the learning of today???s youth. 
                            Through our platform, students gain ownership of their learning process, building towards student-centred accountability.
                            </Text>
                        </ImageBackground>
                    </View>

                    {/* SIGN UP */}
                    <View style={styles.guide}>
                        <View style={{flexDirection: 'column', width: '55%'}}>
                            <Text style={styles.guideTitle}>How It Works? - Sign Up</Text>
                            <Text style={styles.guideText}>
                                1. Sign up and you will get unlimited questions sourced from PSLE Papers! Not sure if this is for you? Do our trial quiz to find out!
                                {`\n\n`}
                                As a registered user, you will have free and unlimited access to all our quizzes and practice papers. See yourself on our global leaderboard and improve your scores with our post-quiz breakdown.
                                {`\n\n`}
                                Join a community with fellow students and compete with their friends! Parents can share administrative rights within the community to assign homework, view performance statistics and track your child???s progress.
                                {`\n\n`}
                                2. Parents can create groups and invite students. Assign quizzes and homework, track your progress all in one place!
                            </Text>
                        </View>
                        <Video source={require('../../../assets/howitworks-signup.mp4')} shouldPlay isLooping style={{ width: 500, height: 500, resizeMode: 'contain' }}/>
                    </View>
                    {/* QUIZ */}
                    <View style={styles.guide}>
                        <Video source={require('../../../assets/howitworks-quiz.mp4')} shouldPlay isLooping style={{ width: 500, height: 500, resizeMode: 'contain' }}/>
                        <View style={{flexDirection: 'column', width: '70%', paddingLeft: 100}}>
                            <Text style={styles.guideTitle}>How It Works? - Quiz</Text>
                            <Text style={styles.guideText}> 
                                1. Take a quiz and compare your score with peers on our leaderboard! Track your process and find out where you can improve. Remember to check your timing too - every second counts!
                                {`\n\n`}
                                2. Questions are auto-generated and broadly classified into three levels of difficulty - Easy, Medium & Hard. Select the appropriate level from Primary 1-6 and choose a topic (Eg. Fractions). After the quiz, view your progress and sign up to view your statistics!
                            </Text>
                        </View>
                    </View>

                    <View style={styles.contactUs}>
                        <Text style={styles.contactTitle}>Contact Us</Text>
                        <Text style={styles.contactText}>
                            We would like to gather your feedback to improve our website in the effort of providing the best platform for students to learn Mathematics in a fun and interactive way. Please do kindly share with us your thoughts.
                        </Text>
                        <View style={styles.form}>
                            <Text style={styles.formText}>Name</Text>
                            <TextInput style={styles.input} 
                                placeholder=' Enter name...' 
                                onChangeText={(val) => setName(val)} 
                                value={name}> 
                            </TextInput>
                        </View>
                        <View style={styles.form}>
                            <Text style={styles.formText}>Email</Text>
                            <TextInput style={styles.input} 
                                placeholder=" Enter email..." 
                                onChangeText={(val) => setEmail(val)} 
                                value={email}> 
                            </TextInput>
                        </View>
                        <View style={styles.form}>
                            <Text style={styles.formText}>Your Message</Text>
                            <TextInput style={styles.messageInput} 
                                multiline placeholder=" Leave your message here..." 
                                onChangeText={(val) => setMessage(val)} 
                                value={message}> 
                            </TextInput>
                        </View>
                        <View style={styles.submitBtn}>
                            <Button title="Submit"></Button>
                        </View>
                    </View>

                    <View>
                        <ImageBackground source={require('../../../assets/conclusionbackgroundimage.jpg')} style={styles.backgroundImage}>
                            <Text style={styles.conclusionText}>
                                Math helps to strengthen your child's problem-solving and thinking skills for life.
                            </Text>
                            <Text style={styles.conclusionText}>
                                Lets start learning today!
                            </Text>
                            <View style={{width: 100, alignSelf: 'center', paddingTop: 20}}>
                                <Button title="SIGN UP" color="#594cda" ></Button>
                            </View>
                        </ImageBackground>
                    </View>

                    <View style={styles.footer}>
                        <Image style={styles.mouse} source={require('../../../assets/mouse.png')}></Image>     
                        <View style={styles.footerChild}>
                            <Text style={styles.footerTitle}>SUPPORT</Text>
                            <Text style={styles.footerText}>Support Centre</Text>
                            <Text style={styles.footerText}>Starter Guides</Text>
                        </View>
                        <View style={styles.footerChild}>
                            <Text style={styles.footerTitle}>COMPANY</Text>
                            <Text style={styles.footerText}>About Us</Text>
                            <Text style={styles.footerText}>Contact Us</Text>
                        </View>
                        <View style={styles.footerChild}>
                            <Text style={styles.footerTitle}>RESOURCES</Text>
                            <Text style={styles.footerText}>Learning Resources</Text>
                            <Text style={styles.footerText}>QEDED Insights</Text>
                        </View>
                        <View style={styles.footerChild}>
                            <Text style={styles.footerTitle}>RESEARCHES</Text>
                            <Text style={styles.footerText}>Singapore MOE</Text>
                            <Text style={styles.footerText}>E-learning Advantages</Text>
                        </View>
                    </View>

                    <View style={styles.copyright}>
                        <Text style={styles.copyrightText}>Copyright ?? All Rights Reserved by 2021 QEDED PTE LTD.</Text>
                        <Text style={{paddingHorizontal: 50, fontSize: 15}}>Terms & Condition ?? Refund Policy ?? Privacy Policy</Text>
                        <Entypo name="facebook-with-circle" size={40} color="#818a91" style={{paddingHorizontal: 5}}/>
                        <Entypo name="twitter-with-circle" size={40} color="#818a91" style={{paddingHorizontal: 5}}/>
                        <Entypo name="linkedin-with-circle" size={40} color="#818a91" style={{paddingHorizontal: 5}}/>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 150,
        backgroundColor: '#f1f9fc',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    image: {
        width: '25%',
        height: '100%',
        resizeMode: 'contain',
        marginLeft: 40,
        marginRight: 50
    },
    carousel: {
        height: 700
    },
    bannerImage: {
        resizeMode: 'contain',
        width: Dimensions.get('window').width,
        height: '100%'
    },
    aboutBackgroundImage: {
        height: 500,
        width: Dimensions.get('window').width,
        resizeMode: 'contain',
        paddingTop: 100,
        paddingHorizontal: 150
    },
    about: {
        fontWeight: 'bold',
        fontSize: 25
    },
    aboutParagraph: {
        fontSize: 20,
        paddingTop: 10,
    },
    guide: {
        height: 700,
        backgroundColor: "#fffff2",
        paddingHorizontal: 150,
        paddingVertical: 50,
        flexDirection: 'row'
    },
    guideTitle: {
        paddingTop: 10,
        fontWeight: 'bold',
        fontSize: 25
    },  
    guideText: {
        fontSize: 20,
        paddingTop: 10,
        width: '50%'
    },
    contactUs: {
        height: 600,
        paddingHorizontal: 170,
        backgroundColor: '#fffff2'
    },
    contactTitle: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        paddingTop: 30
    },
    contactText: {
        alignSelf: 'center',
        fontSize: 17
    },
    form: {
        paddingHorizontal: 0,
        flexDirection: 'row',
        paddingVertical: 20,
        justifyContent: 'space-between'
    },
    formText: {
        fontSize: 17,
        paddingVertical: 10,
    },
    input: {
        height: 48,
        width: 700,
        borderWidth: 1.5,
        borderRadius: 7,
        marginHorizontal: 15,
    },
    messageInput: {
        height: 150,
        width: 700,
        borderWidth: 1.5,
        borderRadius: 7,
        marginHorizontal: 15,
    },
    submitBtn: {
        alignSelf: 'center',
        width: 150,
    },
    backgroundImage: {
        height: 400,
        width: Dimensions.get('window').width,
        resizeMode: 'contain',
        paddingTop: 150
    },
    conclusionText: {
        fontWeight: 'bold',
        fontSize: 25,
        alignSelf: 'center'
    },
    footer: {
        height: 250,
        backgroundColor: '#f1f9fc',
        paddingHorizontal: 150,
        flexDirection: 'row',
    },
    mouse: {
        height: 200,
        width: 100,
        resizeMode: 'contain',
    },
    footerChild: {
        marginHorizontal: 40,
        flexDirection: 'column',
        paddingTop: 60,
    },  
    footerTitle: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    footerText: {
        fontSize: 18,
        color: '#737373'
    },
    copyright: {
        backgroundColor: '#f1f9fc',
        paddingHorizontal: 150,
        flexDirection: 'row',
        paddingBottom: 50,
    },
    copyrightText: {
        fontSize: 15
    },
});
