import client from "../clientConfig";
import path from "../paths";

export default editGroupImg = async (groupId, formData) => {
    const result = await client
        .put(`${path.groupPath}/pfp/${groupId}`, formData)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
