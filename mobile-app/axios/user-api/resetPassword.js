import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default resetPassword = async (data) => {
    const result = await client
    .put(`${path.userPath}/resetPassword`, data)
    .then(({ data }) => {
        return data;
    })
    .catch(({ response }) => {
        throw response.data;
    })
    return result;
}