import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";
import axios from "axios";

const baseURL = `https://code-sphere-server-nu.vercel.app`;

const useAxiosSecure = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    // Stable instance per hook usage
    const instance = useMemo(() => {
        return axios.create({ baseURL });
    }, []);

    useEffect(() => {
        // Request interceptor: attach token if present
        const reqId = instance.interceptors.request.use(
            (config) => {
                const token = user?.accessToken;
                if (token) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = `Bearer ${token}`;
                } else if (
                    config.headers &&
                    "Authorization" in config.headers
                ) {
                    delete config.headers.Authorization;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor: handle 401/403
        const resId = instance.interceptors.response.use(
            (res) => res,
            async (error) => {
                const status = error?.response?.status;
                if (status === 403) {
                    navigate("/forbidden");
                } else if (status === 401) {
                    try {
                        await logoutUser?.();
                    } catch {
                        // ignore logout errors
                    }
                    navigate("/auth/login");
                }
                return Promise.reject(error);
            }
        );

        return () => {
            instance.interceptors.request.eject(reqId);
            instance.interceptors.response.eject(resId);
        };
    }, [instance, navigate, user?.accessToken, logoutUser]);

    return instance;
};

export default useAxiosSecure;
