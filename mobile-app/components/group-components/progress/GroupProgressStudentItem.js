import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import getFilter from "../../../axios/group-api/getFilter";
import getUserGroupBenchmark from "../../../axios/group-api/getUserGroupBenchmark";
import GroupProgressItem from "./GroupProgressItem";
import { FontAwesome5 } from '@expo/vector-icons'; 

const GroupProgressStudentItem = ({groupId, studentName, studentId, chart, loading}) => {

    function extractUserBenchmarkData(data) {
        let result = [];
    
        result.push(data.recent);
        result.push(data.group);
        result.push(data.global);
    
        return result;
    }

    function handleData(data) {
        let title = []
            let isAvailable = true;
            let extractedData = [];

            // isAvailable = !jQuery.isEmptyObject({data});

            Object.keys(data).forEach(key => {
                if (data[key].recent != undefined) {
                    title.push(key)
                    extractedData.push(extractUserBenchmarkData(data[key]));

                    getFilter(groupId, studentId)
                    .then(( data ) => {
                        console.log(data);
                    })
                }
                else {
                    isAvailable = false;
                    return false;
                }
            })

            if (isAvailable) {

                chart();


                for (let i = 0; i < extractedData.length; i++) {
                    const chartConfiguration = {
                        labels: ['Last 10 Avg', 'Group Avg', 'Global Avg'],
                        datasets: [
                          {
                            data: extractedData[i],
                            colors: [
                              (opacity = 1) => `#EF798A`,
                              (opacity = 1) => `#98C5FF`,
                              (opacity = 1) => `#FFCB45`
                          ]
                          }
                        ]
                    }

                    let chartName="";

                    if (title[i] > 6) {
                        chartName = "Secondary " + (title[i] - 6)
                    }
                    else {
                        chartName = "Primary " + title[i]
                    }
                    chart(prevState => [prevState, <Text style={styles.chartHeader}>{chartName}</Text>])
                    chart(prevState => [prevState, <GroupProgressItem chartConfiguration={chartConfiguration} chartWidth={330}></GroupProgressItem>])
                }

            }
            else {
                chart(<View style={styles.chartEmptyContainer}><FontAwesome5 style={styles.chartEmpty} name="chart-bar" size={100}></FontAwesome5><Text>Do a quiz to unlock!</Text></View>)
            }
    }

    return (
        <TouchableOpacity onPress={() => 
        getUserGroupBenchmark(groupId, studentId, "")
        .then(( data ) => {
            loading(true);
            handleData(data);
        })
        .finally(() => {
            loading(false);
        })
        }>
            <Text style={styles.text}>{studentName}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
   text: {
       fontSize: 20,
       marginVertical: 10
   },
   chartHeader: {
        fontWeight: 'bold',
        fontSize: 20,
        marginVertical: 20,
        alignSelf:'center'
   },
   chartEmpty: {
    color: '#EF798A',
    textShadowColor: '#98c5ff',
    textShadowOffset: {width: 5, height: 5},
    textShadowRadius: 10,
   },
   chartEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 150,
    height: 600
},
})



export default GroupProgressStudentItem;