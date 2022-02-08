import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default getQuiz = async () => {
    const data = await AsyncStorage.getItem("userInfo");
    const userId = JSON.parse(data)._id
    const result = await client
    .get(`${path.quizPath}/user?userId=${userId}`)
    .then(({ data }) => {
        return data;
        
    })
    .catch(({ response }) => {
        throw response.data;
    })
    return result;
} 