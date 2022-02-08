import client from "../clientConfig";
import path from "../paths";

export default submitQuiz = async (quizData) => {
    const result = await client
        .post(`${path.quizPath}`, quizData)
        .then(({data}) =>{
            return data;
        })
        .catch(({response}) => {
            throw response.data;
        });
    return result;
}

