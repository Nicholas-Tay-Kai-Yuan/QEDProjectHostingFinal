import { result } from "lodash";
import client from "../clientConfig";
import path from "../paths";

export default deleteGroup = async (groupId) => {

    const result = await client
        .delete(`${path.groupPath}/${groupId}`)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
