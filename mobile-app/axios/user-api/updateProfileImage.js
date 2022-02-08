import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default updateProfileImage = async (formData) => {
    const data = await AsyncStorage.getItem("userInfo");
    const userId = JSON.parse(data)._id

    const result = await client
    .put(`${path.userPath}/pfp/${userId}`, formData)
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