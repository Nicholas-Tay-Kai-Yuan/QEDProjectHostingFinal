import client from "../clientConfig";
import path from "../paths";

export default editLevel = async (data) => {
    const result = await client
        .put(`${path.levelPath}/${id}`, data)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        })
    return result;
}