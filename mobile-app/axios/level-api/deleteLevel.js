import client from "../clientConfig";
import path from "../paths";

export default deleteLevel = async () => {
    const result = await client
        .delete(`${path.levelPath}/${id}`)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        })
    return result;
}