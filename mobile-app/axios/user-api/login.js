import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default login = async (data) => {
    const result = await client
        .post(`${path.userPath}/login`, data)
        .then(({ data }) => {
            storeToken(data);
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};

const storeToken = async (data) => {
    await AsyncStorage.setItem("token", JSON.stringify(data.accessTK));
    await AsyncStorage.setItem("userInfo", JSON.stringify(data.user));
};
