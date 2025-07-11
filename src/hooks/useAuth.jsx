import React, { useContext } from "react";
import { AuthContext } from '../providers/AuthProvider';

const useAuth = () => {
    const { user, loading } = useContext(AuthContext);

    return { user, loading };
};

export default useAuth;
