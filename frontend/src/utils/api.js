export const postRequest = async (url, data, isFormData = false) => {
  try {
    const options = {
      method: "POST",
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      body: isFormData ? data : JSON.stringify(data),
      credentials: "include",
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(
        errorResponse || `Error: ${response.status} - ${response.statusText}`
      );
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      return result;
    }

    return await response.text();
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};
