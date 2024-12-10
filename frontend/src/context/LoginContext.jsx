import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { postRequest } from "../utils/api.js";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await postRequest(
        "http://localhost:5000/api/v1/login",
        loginData
      );

      console.log("Login Successful:", result);

      setLoginData({
        email: "",
        password: "",
      });
      setLoginError("");
      navigate("/");
    } catch (error) {
      setLoginError(error.message || "An error occurred. Please try again.");
      console.error("Login failed:", error.message);
    }
  };

  return (
    <LoginContext.Provider
      value={{
        loginData,
        handleInputChange,
        handleSubmit,
        loginError,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
