import client from "../clientConfig";
import path from "../paths";

export default getGroupQuestionsById = async (userId) => {
    const result = await client
        .get(`${path.qnaPath}/group/${userId}`)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
