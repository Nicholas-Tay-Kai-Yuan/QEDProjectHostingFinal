import path from "../paths";
import client from "../clientConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default getUserAssignment = async () => {
    const userInfo = await AsyncStorage.getItem("userInfo");
    const { _id } = JSON.parse(userInfo);
    const result = await client
        .get(`${path.assignmentPath}/user?userId=${_id}`)
        .then(({ data }) => data)
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
