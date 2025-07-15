import { useState, useEffect } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useUser = (data) => {
    const [userData, setUserData] = useState(null);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        if (!data || !data.email) return;
        axiosSecure.get(`/users/${data.email}`).then((response) => {
            setUserData({
                username: response.data.username.toLowerCase(),
                role: response.data.role,
                badge: response.data.badge,
                aboutMe: response.data.aboutMe,
                _id: response.data._id,
            });
        });
    }, [data]);

    return userData;
};

export default useUser;
