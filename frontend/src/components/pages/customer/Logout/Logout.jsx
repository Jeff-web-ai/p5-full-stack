import { useContext, useEffect } from "react";
import { LogoutContext } from "@/context/LogoutContext";

const Logout = () => {
  const { logoutUser } = useContext(LogoutContext);

  useEffect(() => {
    logoutUser();
  }, [logoutUser]);

  return null;
};

export default Logout;
