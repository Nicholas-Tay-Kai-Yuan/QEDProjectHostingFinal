import AsyncStorage from "@react-native-async-storage/async-storage";
import path from "../paths";
import client from "../clientConfig";

export default getUserNotifications = async () => {
    const userInfo = await AsyncStorage.getItem("userInfo");
    const { _id } = JSON.parse(userInfo);
    const result = await client
        .get(`${path.notificationPath}/user?userId=${_id}`)
        .then(({ data }) => data)
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
