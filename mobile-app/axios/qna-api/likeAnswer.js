import client from "../clientConfig";
import path from "../paths";

export default likeAnswer = async (answerId, data) => {
    const result = await client
        .post(`${path.qnaPath}/question/answer/${answerId}/like`, data)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
