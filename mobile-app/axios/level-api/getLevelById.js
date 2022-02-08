import client from "../clientConfig";
import path from "../paths";

export default getLevelById = async () => {
    const result = await client
        .get(`${path.levelPath}/${id}`)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        })
    return result;
}