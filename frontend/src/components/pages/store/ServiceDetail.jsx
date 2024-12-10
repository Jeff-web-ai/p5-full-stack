import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, MapPin, Calendar } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_SERVER;

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) throw new Error("Please login to access this resource");

      const { accessToken } = JSON.parse(storedUser);
      if (!accessToken) throw new Error("Access token not found");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/get-request-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to fetch service details for ID: ${id}`
        );
      }

      const data = await response.json();
      setService(data.data);
    } catch (err) {
      setError(err.message);
      if (err.message === "Please login to access this resource") {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "open":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleAcceptRequest = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) throw new Error("Please login to access this resource");

      const { accessToken } = JSON.parse(storedUser);
      if (!accessToken) throw new Error("Access token not found");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/accept-request/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to accept request");
      }

      // Refresh the service details after accepting
      await fetchServiceDetails();
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">Error loading service details: {error}</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">No service details found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-6">
        <Button
          variant="outline"
          className="mb-6 border-blue-600 text-blue-600 hover:bg-blue-50"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-2xl text-blue-600 mb-8">Service Details</h2>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 mb-8">
              <div className="space-y-4">
                <div className="flex">
                  <span className="text-blue-600 w-32">Service Type:</span>
                  <span>{service.serviceID?.serviceName || "N/A"}</span>
                </div>
                <div className="flex">
                  <span className="text-blue-600 w-32">Full Name:</span>
                  <span>{service.fullName}</span>
                </div>
                <div className="flex">
                  <span className="text-blue-600 w-32">Email:</span>
                  <span>{service.email}</span>
                </div>
                <div className="flex">
                  <span className="text-blue-600 w-32">Contact Number:</span>
                  <span>{service.contactNumber}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex">
                  <span className="text-blue-600 w-32">Status:</span>
                  <Badge
                    variant="outline"
                    className={getStatusColor(service.status)}
                  >
                    {service.status || "Open"}
                  </Badge>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 w-32 flex-shrink-0">
                    Address:
                  </span>
                  <span className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                    {service.address}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-blue-600 w-32">Landmark:</span>
                  <span>{service.landmark}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-600 w-32">Date:</span>
                  <span className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                    {service.date}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl text-blue-600 mb-2">Problem Details</h3>
              <p className="text-gray-700">{service.problemDetails}</p>
            </div>

            {service.images && service.images.url && (
              <div className="mt-8">
                <h3 className="text-xl text-blue-600 mb-4">Image</h3>
                <div className="w-full max-w-2xl mx-auto">
                  <img
                    src={service.images.url}
                    alt="Service request image"
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-center mt-8">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-8 flex items-center"
                onClick={handleAcceptRequest}
                disabled={service.status !== "Open"}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                {service.status === "Open"
                  ? "Accept Request"
                  : "Request Accepted"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
