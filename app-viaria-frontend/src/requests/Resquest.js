import axios from "axios";
import router from "../router";
import { useAuthStore } from "src/stores/auth";
const baseDomain = "http://localhost:1337/api";
const baseURL = `${baseDomain}`;

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use(
  function (config) {
    const authStore = useAuthStore();
    if (authStore.isValidDateToken) {
      config.headers.Authorization = `Bearer ${authStore.getToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    const authStore = useAuthStore();
    // eslint-disable-next-line no-prototype-builtins
    if (response.headers.hasOwnProperty("authorization")) {
      authStore.updateToken({
        token: response.headers.authorization,
        date: new Date(),
      });
    }
    return response;
  },
  (error) => {
    const authStore = useAuthStore();
    if (error.response.status === 401 || error.response.status === 403) {
      authStore.removeToken;
      const path = error.response.data.path;
      const to = path.split(window.location.origin).pop();

      router.push({ name: "Login", params: { to: to, invalidToken: true } });
    } else {
      throw error;
    }
  }
);

export default instance;
