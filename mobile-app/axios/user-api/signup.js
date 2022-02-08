import { result } from "lodash";
import client from "../clientConfig";
import path from "../paths";

export default signup = async (data) => {
    const result = await client
    .post(`${path.userPath}/`, data)
    .then(({ data }) => {
        return data;
    })
    .catch(({ response }) => {
        throw response.data;
    })
    return result;
}