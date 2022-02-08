import client from "../clientConfig";
import path from "../paths";

export default getSkillById = async (id) => {
    const result = await client
        .get(`${path.skillPath}/${id}`)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        })
    return result;
}