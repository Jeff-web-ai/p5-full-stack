import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { postRequest } from "@/utils/api";

export const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    contactNumber: "",
    address: "",
    avatar: null,
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const result = await postRequest(
        "http://localhost:5000/api/v1/register-non-user",
        formDataToSend,
        true
      );

      console.log("Registration Successful:", result);
      setFormData({
        email: "",
        password: "",
        name: "",
        contactNumber: "",
        address: "",
        avatar: null,
      });
      setError("");
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <RegistrationContext.Provider
      value={{
        formData,
        setFormData,
        error,
        handleInputChange,
        handleSubmit,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};
