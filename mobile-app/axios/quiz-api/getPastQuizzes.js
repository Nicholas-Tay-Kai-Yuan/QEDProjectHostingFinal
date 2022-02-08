import client from "../clientConfig";
import path from "../paths";

export default getPastQuizzes = async (quizId) => {
    const result = await client
    .get(`${path.quizPath}/${quizId}`)
    .then(({ data }) => {
        return data;
        
    })
    .catch(({ response }) => {
        throw response.data;
    })
    return result;
} 

