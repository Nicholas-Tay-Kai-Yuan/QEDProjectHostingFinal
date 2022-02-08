import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default resetPasswordRequest = async (data) => {
    const result = await client
    .post(`${path.userPath}/resetPasswordRequest`, data)
    .then(({ data }) => {
        return data;
    })
    .catch(({ response }) => {
        throw response.data;
    })
    return result;
}