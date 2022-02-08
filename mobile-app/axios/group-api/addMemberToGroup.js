import client from "../clientConfig";
import path from "../paths";

export default addMemberToGroup = async (groupId, userId) => {
    const result = await client
        .post(`${path.groupPath}/addMember?groupId=${groupId}&userId=${userId}`)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
