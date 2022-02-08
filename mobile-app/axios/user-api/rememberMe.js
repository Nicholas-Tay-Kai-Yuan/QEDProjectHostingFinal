import client from "../clientConfig";
import path from "../paths";

export default rememberMe = async () => {
    const result = await client
        .post(`${path.userPath}/user/refresh_token`)
        .then(({ data }) => {
            let token = data.accessToken;
            let base64Url = token.split('.')[1]; // token you get
            let base64 = base64Url.replace('-', '+').replace('_', '/');
            let decodedData = JSON.parse(window.atob(base64));
            
            storeToken(token);
            return decodedData;
           
        })
        .catch(({ response }) => {
            console.log(response)
            throw response.data;
        });
    return result;
}

const storeToken = async (data) => {
    await AsyncStorage.setItem("token", data.accessTK);
    await AsyncStorage.setItem("userInfo", JSON.stringify(data.user));
};
