import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default logout = async () => {
    const result = await client
        .post(`${path.userPath}/logout`)
        .then(({ data }) => {
            removeToken();
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
}

const removeToken = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userInfo");
};
