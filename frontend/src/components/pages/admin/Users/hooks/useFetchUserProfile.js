import { useState } from "react";

export const useFetchUserProfile = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserDetails = async (userId) => {
    setIsLoading(true);
    setError(null);

    try {
      const storedUser = localStorage.getItem("user");
      const { accessToken } = JSON.parse(storedUser);

      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/get-user-info/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setError(json.message);
        throw new Error(json.message);
      }

      setError(null);
      return json.userInfo;
    } catch (error) {
      setError("An unexpected error occurred");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchUserDetails, isLoading, error };
};
