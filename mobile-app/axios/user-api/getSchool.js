import client from "../clientConfig";
import path from "../paths";

export default getSchool = async () => {
    let resource_id = 'ede26d32-01af-4228-b1ed-f05c45a1d8ee'
    let q = 'primary'
    let limit = 200
    const result = await client
        .get(`https://data.gov.sg/api/action/datastore_search?resource_id=${resource_id}&q=${q}&limit=${limit}`)
        .then((data) => {
            return data;
        })
        .catch(({ response }) => {
            throw response.data;
        })
    return result;
};