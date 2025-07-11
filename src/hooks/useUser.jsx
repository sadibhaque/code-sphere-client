import axios from "axios/unsafe/axios.js";
import { useState, useEffect } from "react";

const useUser = (data) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!data || !data.email) return;
        axios
            .get(`http://localhost:3000/users/${data.email}`)
            .then((response) => {
                setUserData({
                    username: response.data.username.toLowerCase(),
                    role: response.data.role,
                    badge: response.data.badge,
                });
            });
    }, [data]);

    return userData;
};

export default useUser;
