import axios from "axios";

const baseURL = "http://localhost:8000/api";

const axiosApi = axios.create({
  baseURL: baseURL, // Adres do serwera Django
  timeout: 200000,
  headers: {
    Authorization: localStorage.getItem("token")
      ? "Token " + localStorage.getItem("token")
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
    // userId: JSON.parse(localStorage.getItem("user")).user?.id,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Heders": "privatekey"
  },
});

axiosApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (typeof error.response === "undefined") {
      // alert(
      //   "Wystąpił problem połączenia z serwer. Sprwadź łącze internetowe i spóbuj ponownie. " +
      //    "W przypadku nierozwiązania problemu skontaktuj się z działem IT"
      // );
      return Promise.reject(error);
    }

    if (
      originalRequest.url === baseURL + "/api/auth/logout" &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      axiosApi.defaults.headers["Authorization"] =
        "Token " + localStorage.getItem("token");
      originalRequest.headers["Authorization"] =
        "Token " + localStorage.getItem("token");

      return axiosApi;
    }

    return Promise.reject(error);
  }
);

export { axiosApi };
