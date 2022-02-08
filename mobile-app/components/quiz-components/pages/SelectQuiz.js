// import React, {useEffect, useState} from "react";
// import { View, StyleSheet, Text, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Image } from "react-native";
// import { LinearGradient } from 'expo-linear-gradient';
// import Sidebar from "../../common/side-navigations/Sidebar";
// import Headers from "../../common/headers/Header";
// import getAllQuizzes from "../../../axios/quiz-api/getAllQuizzes"
// import getLevel from "../../../axios/level-api/getLevel";

// export default Overview = () => {
//     return (
//         <SafeAreaView>
//             <View style={styles.container}>
//                 <Sidebar currentPage={}></Sidebar>
//                 <ScrollView style={{flexDirection: 'column'}}>
//                     <Headers text={"Quiz"}></Headers>
//                     <View style={styles.primaryContainer}>
//                         <LinearGradient 
//                         colors={['#7F7FD5', '#86A8E7', '#91EAE4']}>
//                             <Text style={styles.headerText}>Primary School</Text>
//                             <Image style={styles.image} source={require('../../../assets/primary_img.png')}></Image>
//                         </LinearGradient>
//                     </View>
//                 </ScrollView>
//             </View>
//         </SafeAreaView>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flexDirection: 'row',
//         height: '100%'
//     },
//     primaryContainer: {
//         height: 400,
//         width: Dimensions.get('window').width * 0.3,
//         paddingLeft: 30,
//         borderRadius: 15
//     },
//     headerText: {
//         fontSize: 30,
//         color: '#FFFFFF',
//         marginVertical: 20,
//         alignSelf: 'center'
//     },
//     image: {
//         resizeMode: 'contain',
//         width: 'auto',
//         height: '100%',
//     }
// });

