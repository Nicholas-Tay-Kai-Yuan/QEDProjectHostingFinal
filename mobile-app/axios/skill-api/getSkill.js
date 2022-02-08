import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default getSkill = async (skillId) => {
    const result = await client
        .get(`${path.skillPath}/${skillId}`)
        .then(({data}) =>{
            return data;
        })
        .catch(({response}) => {
            throw response.data;
        });
    return result;
}

