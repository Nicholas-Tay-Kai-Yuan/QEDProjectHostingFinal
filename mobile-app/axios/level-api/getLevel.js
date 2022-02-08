import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default getLevel = async () => {
    const result = await client
        .get(`${path.levelPath}`)
        .then(({data}) =>{
            return data;
        })
        .catch(({response}) => {
            throw response.data;
        });
    return result;
}

