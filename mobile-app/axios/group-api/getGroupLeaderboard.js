import client from "../clientConfig";
import path from "../paths";

export default getGroupLeaderboard = async (sort = 1, groupId) => {
    const result = client
        .post(`${path.groupPath}/leaderboard?sort=${sort}&groupId=${groupId}`)
        .then(({ data }) => data)
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
