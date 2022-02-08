import client from "../clientConfig";
import path from "../paths";

export default unlikeAnswer = async (answerId, data) => {
    const result = await client
        .delete(`${path.qnaPath}/question/answer/${answerId}/unlike`, {data})
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
