import client from "../clientConfig";
import path from "../paths";

export default getFilter = async (groupId, userId) => {
    const result = await client
        .post(`${path.groupPath}/benchmarkFilter?groupId=${groupId}&user=${userId}`)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
