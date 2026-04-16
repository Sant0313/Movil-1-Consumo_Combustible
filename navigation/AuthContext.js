import { createContext, useContext } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Aca va un mensaje especifico de error");
    }
    return context;
};