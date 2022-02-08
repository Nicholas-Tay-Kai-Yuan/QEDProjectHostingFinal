import React from "react";
import { BarChart } from "react-native-chart-kit";


const StatisticsItem = ({chartConfiguration, chartWidth}) => {

    return (

        <BarChart
        data={chartConfiguration}
        width={chartWidth} // from react-native
        height={220}
        chartConfig={{
            backgroundColor: "transparent",
            backgroundGradientTo: "white",
            backgroundGradientFromOpacity: 0,
            backgroundGradientFrom: "white",
            backgroundGradientToOpacity: 0,
            decimalPlaces: 0,
            color: (opacity = 1) => `white`,
            labelColor: (opacity = 1) => `black`, 
        }}
        fromZero={true}
        withCustomBarColorFromData={true}
        flatColor={true}/>
    );
};

export default StatisticsItem;