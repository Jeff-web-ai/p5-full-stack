import { createContext } from "react";
import { useNavigate } from "react-router-dom";

export const LogoutContext = createContext();

export const LogoutProvider = ({ children }) => {
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      const result = await fetch("http://localhost:5000/api/v1/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (result.ok) {
        console.log("Logout Successful:", result);
        navigate("/");
      } else {
        console.error("Logout failed: ", result.statusText);
      }
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <LogoutContext.Provider
      value={{
        logoutUser,
      }}
    >
      {children}
    </LogoutContext.Provider>
  );
};
