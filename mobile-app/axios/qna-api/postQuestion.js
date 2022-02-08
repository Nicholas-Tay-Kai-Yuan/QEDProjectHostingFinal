import client from "../clientConfig";
import path from "../paths";

export default postQuestion = async (groupId, data) => {
    
    const result = await client
        .post(`${path.qnaPath}/group/${groupId}`, data)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
