import client from "../clientConfig";
import path from "../paths";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default getLeaderboard = async (
    level = "Primary",
    type = 1,
    filter = 1
) => {
    const userInfo = await AsyncStorage.getItem("userInfo");
    const result = await client
        .post(
            `${path.quizPath}/leaderboard?sort=${type}&scope=${level}&filter=${filter}`,null,{
                headers: {
                    user: userInfo
                }
            }
        )
        .then(({ data }) => data)
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
