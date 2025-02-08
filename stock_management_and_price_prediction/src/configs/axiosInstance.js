import axios from "axios";
// import NProgress from "nprogress";
const baseUrl = 'http://localhost:5000';


const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    // NProgress.configure({ showSpinner: true });
    // NProgress.start();

    const token = localStorage.getItem("token"); // Get token from localStorage

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach JWT token
  }

  return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        // NProgress.done();
        return response;
    },
    (error) => {
        // NProgress.done();

        if (error.response) {
            if (error.response.status === 403) {
               console.log('403')
            }

            if (error.response.status === 401) {
                window.location.href = "/auth/sign-in"; 
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
