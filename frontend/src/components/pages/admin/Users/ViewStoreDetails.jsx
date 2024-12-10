import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

import { useFetchUserProfile } from "./hooks/useFetchUserProfile.js";

// Hardcoded feedback data
const feedbacks = [
  {
    id: 1,
    customerName: "John Doe",
    feedback: "Great service! Very professional and timely.",
    rating: 5,
  },
  {
    id: 2,
    customerName: "Jane Smith",
    feedback: "Good experience overall. Could improve on communication.",
    rating: 4,
  },
  {
    id: 3,
    customerName: "Mike Johnson",
    feedback: "Excellent work. Will definitely use again.",
    rating: 5,
  },
];

const ViewStoreDetails = () => {
  const { storeId } = useParams();
  const [storeDetails, setStoreDetails] = useState();

  const { fetchUserDetails, isLoading, error } = useFetchUserProfile();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUserDetails(storeId);
        setStoreDetails(user);
        console.log(user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [storeId]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
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

  if (!storeDetails) {
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
                    storeDetails.avatar?.url ||
                    "/placeholder.svg?height=96&width=96"
                  }
                  alt={storeDetails.name}
                />
                <AvatarFallback>{storeDetails.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold">{storeDetails.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {renderStars(Math.floor(storeDetails.totalRatings || 0))}
                  </div>
                  <span className="ml-2 text-lg">
                    {parseFloat(storeDetails.totalRatings).toFixed(1) || 0} (
                    {feedbacks.length} reviews)
                  </span>
                </div>
              </div>
            </div>
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
                onClick={() => navigate(`/admin/update-store/${storeId}`)}
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
                <MessageSquare className="mr-2" />
                Shop Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 mt-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">Email</h3>
                  <p>{storeDetails.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">
                    Contact Number
                  </h3>
                  <p>{storeDetails.contactNumber}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">Member Since</h3>
                  <p>
                    {new Date(storeDetails.createdAt).toLocaleDateString(
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

          {/* Feedbacks Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2" />
                Customer Feedbacks
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="space-y-4">
                {feedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-700">
                        {feedback.customerName}
                      </h3>
                      <div className="flex">{renderStars(feedback.rating)}</div>
                    </div>
                    <p className="text-gray-600">{feedback.feedback}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewStoreDetails;
