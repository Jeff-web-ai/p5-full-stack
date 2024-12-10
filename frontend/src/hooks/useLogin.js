import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        setError(json.message);
      } else {
        // save the user to local storate
        localStorage.setItem("user", JSON.stringify(json));
        dispatch({ type: "LOGIN", payload: json });

        setIsLoading(false);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
