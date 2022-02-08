import client from "../clientConfig";
import path from "../paths";

export default getGroupMembers = async (groupId) => {
    const result = await client
        .get(`${path.groupPath}/members?groupId=${groupId}`)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
