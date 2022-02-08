import axios from "axios";
const serverLocation = "http://10.0.2.2:3000";

const client = axios.create({
    baseURL: serverLocation,
    timeout: 10000,
});

export default client;
