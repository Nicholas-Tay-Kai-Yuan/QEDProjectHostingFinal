import client from "../clientConfig";
import path from "../paths";

export default addGroupImg = async (data, formData) => {
    const result = await client
        .put(`${path.groupPath}/pfp/${data.new_id}`, formData)
        .then(({ data }) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        });
    return result;
};
