import client from "../clientConfig";
import path from "../paths";

export default getGroupBenchmark = async (groupId) => {
    const result = await client
        .post(`${path.groupPath}/benchmark?groupId=${groupId}`)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
