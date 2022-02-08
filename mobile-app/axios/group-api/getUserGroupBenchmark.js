import client from "../clientConfig";
import path from "../paths";

export default getUserGroupBenchmark = async (groupId, userId, params) => {
    const result = await client
        .post(`${path.groupPath}/benchmarkByUser?groupId=${groupId}&user=${userId}${params}`)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
