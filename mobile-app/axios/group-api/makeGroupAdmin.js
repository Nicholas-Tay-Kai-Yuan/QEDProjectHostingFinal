import client from "../clientConfig";
import path from "../paths";

export default makeGroupAdmin = async (groupId, userId) => {
    const result = await client
        .put(`${path.groupPath}/makeAdmin?groupId=${groupId}&userId=${userId}`)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
