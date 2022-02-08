import client from "../clientConfig";
import path from "../paths";

export default addLevel = async (data) => {
    const result = await client
        .post(`${path.levelPath}/`, data)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        })
    return result;
}