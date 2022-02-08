import { result } from "lodash";
import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default updateProfile = async (data) => {
    const userInfo = await AsyncStorage.getItem("userInfo");
    const userId = JSON.parse(userInfo)._id

    const result = await client
    .put(`${path.userPath}/${userId}`, data)
    .then(({ data }) => {
        storeUserInfo(data);
        return data;
    })
    .catch(({ response }) => {
        throw response.data;
    })
    return result;
}

const storeUserInfo = async (data) => {
    await AsyncStorage.setItem("userInfo", JSON.stringify(data.user));
};