import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";
var jwtDecode = require('jwt-decode');

export default addSkill = async (id, data) => {
    let tokenData = await AsyncStorage.getItem("token");
    let token = tokenData.substring(1, tokenData.length - 1);
    var decoded = jwtDecode(token);

    // token expired
    if (decoded.exp*1000 < new Date()) {
        await client
        .post(`/user/refresh_token`)
        .then(({data}) => {
            storeToken(data);
            return data;
        })
        .catch(({response}) => {
            throw response
        })  
    }

    tokenData = await AsyncStorage.getItem("token");
    token = tokenData.substring(1, tokenData.length - 1);

    const result = await client
        .post(`${path.skillPath}/${id}`, data, {
            headers: {
                Authorization: (token != null) ? "Bearer " + token : ""
            }
        })
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        })
    return result;
}

const storeToken = async (data) => {
    await AsyncStorage.setItem("token", JSON.stringify(data.accessToken));
};