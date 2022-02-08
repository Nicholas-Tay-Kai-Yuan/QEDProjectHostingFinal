import client from "../clientConfig";
import path from "../paths";

export default setDefault = async (data) => {
    const result = await client
        .post(`${path.levelPath}/resetDefault`, data)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        })
    return result;
}