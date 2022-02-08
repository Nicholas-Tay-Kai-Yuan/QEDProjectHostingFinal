import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default getRecommendation = async () => {
    const userInfo = await AsyncStorage.getItem("userInfo");
    const { _id } = JSON.parse(userInfo)
    const result = await client
        .get(`${path.quizPath}/recommendation?userId=${_id}`)
        .then(({ data }) => data)
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
