import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default getAllQuizzes = async () => {
    const result = await client
        .get(`${path.quizPath}`)
        .then(({data}) =>{
            return data;
        })
        .catch(({response}) => {
            throw response.data;
        });
    return result;
}

