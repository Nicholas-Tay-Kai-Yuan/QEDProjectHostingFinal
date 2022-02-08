import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default checkifUserisAdmin = async (groupId) => {
    const userInfo = await AsyncStorage.getItem("userInfo");
    const userId = JSON.parse(userInfo)._id

    const result = await client
        .get(`${path.groupPath}/isGrpAdmin?groupId=${groupId}&userId=${userId}`)
        .then(({ data }) => {
            return data;          
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};