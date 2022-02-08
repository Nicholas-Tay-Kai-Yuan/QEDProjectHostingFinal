import client from "../clientConfig";
import path from "../paths";

export default getPopularQuiz = async () => {
    const result = await client
    .get(`${path.quizPath}/popular`)
    .then(({ data }) => data)
    .catch(({ response }) => {
        throw response.data;
    });
return result;
}