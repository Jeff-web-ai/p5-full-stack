import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const signup = async (formDataToSend) => {
    setIsLoading(true);
    setError(null);

    const data = formDataToSend;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/register-non-user`,
        {
          method: "POST",
          body: data,
        }
      );

      const json = await response.json();

      console.log("Registration Successful: ", json);
      if (!response.ok) {
        setError(json.message);
      } else {
        setError(false);
        navigate("/login");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
