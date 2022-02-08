import client from "../clientConfig";
import path from "../paths";

export default removeMemberFromGroup = async (groupId, userId) => {
    const result = await client
        .delete(`${path.groupPath}/removeMember?groupId=${groupId}&userId=${userId}`)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
