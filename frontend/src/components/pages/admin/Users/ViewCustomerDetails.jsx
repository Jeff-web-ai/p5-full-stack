import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  ChevronRight,
  Loader2,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useFetchUserProfile } from "./hooks/useFetchUserProfile.js";

const ViewCustomerDetails = () => {
  const { customerId } = useParams();
  const [customerDetails, setCustomerDetails] = useState();

  const navigate = useNavigate();

  const { fetchUserDetails, isLoading, error } = useFetchUserProfile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUserDetails(customerId);
        console.log(user);
        setCustomerDetails(user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [customerId]);

  if (!customerDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">No store profile found. Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Avatar className="w-24 h-24 border-4 border-white rounded-full bg-blue-600 shadow-lg mr-6">
                <AvatarImage
                  src={
                    customerDetails.avatar?.url ||
                    "/placeholder.svg?height=96&width=96"
                  }
                  alt={customerDetails.name}
                />
                <AvatarFallback>{customerDetails.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold">{customerDetails.name}</h1>
              </div>
            </div>

            {/* action button */}
            <div className="flex space-x-4">
              <Button
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate(-1)}
              >
                <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                Back
              </Button>
              <Button
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate(`/admin/update-customer/${customerId}`)}
              >
                Update Profile
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Info and Request History Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Info Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 mt-4">
              {/* Email */}
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">Email</h3>
                  <p>{customerDetails.email}</p>
                </div>
              </div>
              {/* Contact Number */}
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">
                    Contact Number
                  </h3>
                  <p>{customerDetails.contactNumber}</p>
                </div>
              </div>
              {/* Member Since */}
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">Member Since</h3>
                  <p>
                    {new Date(customerDetails.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request History Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <CardTitle className="flex items-center">
                <History className="mr-2" />
                Request History
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4"></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomerDetails;
