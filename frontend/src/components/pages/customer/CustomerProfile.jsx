import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Wrench,
  ChevronRight,
  Loader2,
  User,
  History,
} from "lucide-react";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomerProfile();
  }, []);

  const fetchCustomerProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) throw new Error("Please login to access this resource");

      const { accessToken } = JSON.parse(storedUser);
      if (!accessToken) throw new Error("Access token not found");

      console.log(
        "Fetching from:",
        `${import.meta.env.VITE_API_SERVER}/api/v1/me`
      );
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          errorData.message ||
            `Failed to fetch store profile. Status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("API Response:", data);
      setCustomer(data.user);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
      if (err.message === "Please login to access this resource") {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
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
        <p className="text-red-600">Error loading store profile: {error}</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">
          No customer profile found. Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner with Store Name and Rating */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Avatar className="w-24 h-24 border-4 border-white rounded-full bg-blue-600 shadow-lg mr-6">
                <AvatarImage
                  src={
                    customer.avatar?.url ||
                    "/placeholder.svg?height=96&width=96"
                  }
                  alt={customer.name}
                />
                <AvatarFallback className="text-3xl font-bold text-white">
                  {customer.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold">{customer.name}</h1>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate("/")}
              >
                <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                Back
              </Button>
              <Button
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate("/customer/profile/update")}
              >
                Update Profile
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Info and Feedback Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Info Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <CardTitle className="flex items-center">
                <User className="mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 mt-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">Email</h3>
                  <p>{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">
                    Contact Number
                  </h3>
                  <p>{customer.contactNumber}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">Address</h3>
                  <p>{customer.address}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">Member Since</h3>
                  <p>
                    {new Date(customer.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <CardTitle className="flex items-center">
                <History className="mr-2" />
                Request History
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Completed Services
                  </h3>
                  <p>
                    {customer.serviceLogID?.map((log, index) => (
                      <span key={index}>
                        {log?.serviceID?.serviceName ?? "No Service Name"} /
                        {log?.jobID?.jobName ?? "No Job Name"}
                        {index < customer.serviceLogID.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
