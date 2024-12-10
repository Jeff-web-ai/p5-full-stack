import { useAuthContext } from "./useAuthContext.js";

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    // remove user from storage
    localStorage.removeItem("user");

    // dispatch logout action
    dispatch({ type: "LOGOUT" });
  };

  return { logout };
};
