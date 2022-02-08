import client from "../clientConfig";
import path from "../paths";

export default postAnswer = async (questionId, data) => {
    const result = await client
        .post(`${path.qnaPath}/question/${questionId}/answer`, data)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
