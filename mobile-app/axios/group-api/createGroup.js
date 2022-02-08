import { result } from "lodash";
import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default createGroup = async (data) => {

    const userInfo = await AsyncStorage.getItem("userInfo");
    const userId = JSON.parse(userInfo)._id

    let json = {
        group_name: data.group_name,
        owner: userId,
        members: data.members
    }

    const result = await client
        .post(`${path.groupPath}`, json)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
