import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default comparisonBenchmark = async (query) => {
    const data = await AsyncStorage.getItem("userInfo");
    const userId = JSON.parse(data)._id

    const result = await client
        .post(`${path.quizPath}/benchmarkComparison?user=${userId}${query}`)
        .then(({ data }) => {
            return data;
        })

    return result;
};