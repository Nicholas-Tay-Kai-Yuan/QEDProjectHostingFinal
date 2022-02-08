import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default createNewAssignment = async (data) => {
    const userInfo = await AsyncStorage.getItem("userInfo");
    const userId = JSON.parse(userInfo)._id

    const result = await client
        .post(`${path.assignmentPath}`,data)
        .then(({ data }) => {
            return data;          
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};