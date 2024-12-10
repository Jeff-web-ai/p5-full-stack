import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const register = async (formDatatoSend) => {
    setIsLoading(true);
    setError(null);

    try {
      // Extracting accessToken on localStorage
      const storedUser = localStorage.getItem("user");
      const { accessToken } = JSON.parse(storedUser);

      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/register`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formDatatoSend,
        }
      );

      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        setError(json.message);
      } else {
        setError(null);
        navigate(-1);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};
