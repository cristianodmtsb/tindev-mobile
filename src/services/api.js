import axios from "axios";
// EMULADOR GENYMOTION: 10.0.3.2
// EMULADOR ANDROID STADUDIO: 10.0.2.2
// USAR LOCALHOST: adb reverse tcp:3333 tcp:3333
const api = axios.create({
    baseURL: "http://localhost:3333"
});

export default api;
