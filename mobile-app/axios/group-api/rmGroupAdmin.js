import client from "../clientConfig";
import path from "../paths";

export default rmGroupAdmin = async (groupId, userId) => {
    const result = await client
        .put(`${path.groupPath}/dismissAdmin?groupId=${groupId}&userId=${userId}`)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
