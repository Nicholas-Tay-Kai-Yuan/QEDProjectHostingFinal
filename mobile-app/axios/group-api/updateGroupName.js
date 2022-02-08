import { result } from "lodash";
import client from "../clientConfig";
import path from "../paths";

export default updateGroupName = async (groupId, data) => {

    const result = await client
        .put(`${path.groupPath}/?groupId=${groupId}`, data)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
