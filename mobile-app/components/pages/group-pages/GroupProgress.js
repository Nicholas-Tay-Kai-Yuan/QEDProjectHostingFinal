import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import SideBar from "../../common/side-navigations/Sidebar";
import GroupTopbar from "../../common/group/topbar-component/GroupTopbar";
import { useLocation } from "react-router-native";
import getGroupMembers from "../../../axios/group-api/getGroupMembers";
import GroupProgressStudentItem from "../../group-components/progress/GroupProgressStudentItem";
import GroupProgressItem from "../../group-components/progress/GroupProgressItem";
import getGroupBenchmark from "../../../axios/group-api/getGroupBenchmark";
import Spinner from 'react-native-loading-spinner-overlay';
import Topbar from "../../common/top-navigations/Topbar"
import { useNavigate } from "react-router-native";

export default GroupProgress = () => {

    const { state } = useLocation();
    const [studentItem, setStudentItem] = useState();
    const [chart, setChart] = useState();
    const [isReady, setReady] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getGroupMembers(state.groupId)
            .then((data) => {
                displayStudentItem(data);
            })

        getGroupBenchmark(state.groupId)
            .then((data) => {
                let extractedData = extractGroupBenchmarkData(data)
                displayChart(extractedData)
            }).finally(() => {
                setReady(false);
            })
    }, [])

    function displayStudentItem(data) {
        let studentItem = [];

        setStudentItem();
        for (let i = 0; i < data.members.length; i++) {
            if (data.members[i].role == "student") {
                studentItem.push(data.members[i]);
            }
        }

        setStudentItem(<View><Text style={styles.studentCount}>{studentItem.length} students</Text></View>)

        for (let i = 0; i < studentItem.length; i++) {
            setStudentItem(prevState => [prevState, <GroupProgressStudentItem groupId={state.groupId} studentName={studentItem[i].user_name} studentId={studentItem[i].user_id} chart={setChart} loading={setReady}></GroupProgressStudentItem>]);
        }
    }

    function displayChart(data) {

        setChart();

        const chartConfiguration = {
            labels: ['Group Avg', 'Global Avg'],
            datasets: [
                {
                    data: data,
                    colors: [
                        (opacity = 1) => `#EF798A`,
                        (opacity = 1) => `#98C5FF`,
                    ]
                }
            ]
        }

        setChart(<Text style={styles.chartHeader}>Latest Score</Text>)
        setChart(prevState => [prevState, <GroupProgressItem chartConfiguration={chartConfiguration} chartWidth={330}></GroupProgressItem>])
    }

    function extractGroupBenchmarkData(data) {
        let result = [];

        result.push(data.group.average_score);
        result.push(data.global.total_average_score);

        return result;
    }

    return (
        <View style={styles.container}>
            <Spinner visible={isReady} textContent="Loading..."></Spinner>
            <SideBar currentPage="My Groups"></SideBar>
            <View style={styles.progressContainer}>
                <View style={styles.topbar}>
                    <Topbar navigate={navigate} />
                </View>
                <GroupTopbar item={5} heading={"Progress"} groupId={state.groupId} groupName={state.groupName} groupImg={state.groupImg}></GroupTopbar>
                <View style={styles.contentContainer}>
                    <View style={{ flex: 9, alignItems: 'center', alignSelf: 'center', marginVertical: 60 }}>
                        <ScrollView>
                            {chart}
                        </ScrollView>
                    </View>
                    <View style={{ flex: 3, marginTop: 100 }}>
                        {studentItem}
                    </View>
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
    progressContainer: {
        flex: 1,
    },
    studentCount: {
        fontWeight: 'bold',
        fontSize: 25,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    contentContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        flex: 1,
    },
    chartHeader: {
        fontWeight: 'bold',
        fontSize: 20,
        marginVertical: 20,
        alignSelf: 'center'
    },
    topbar: {
        height: 60,
    },
});