import React, { createContext, useState } from 'react';

export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        _id: '',

        fullName: '',
        email: '',
        avatar: '',
        isAdmin: false,
    },
});

export const AuthWrapper = (props) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            _id: '',

            fullName: '',
            email: '',
            avatar: '',
            isAdmin: false,
        },
    });

    const [appLoading, setAppLoading] = useState(true);
    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                appLoading,
                setAppLoading,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};
