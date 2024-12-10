import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

const API_BASE_URL = import.meta.env.VITE_API_SERVER;

export default function StoreProfile() {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStoreProfile();
    fetchFeedbacks();
  }, []);

  const fetchStoreProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) throw new Error("Please login to access this resource");

      const { accessToken } = JSON.parse(storedUser);
      if (!accessToken) throw new Error("Access token not found");

      const response = await fetch(`${API_BASE_URL}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to fetch store profile. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setStore(data.user);
      console.log("Fetched store profile:", data.user);
    } catch (err) {
      setError(err.message);
      if (err.message === "Please login to access this resource") {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) throw new Error("Please login to access this resource");

      const { accessToken } = JSON.parse(storedUser);
      if (!accessToken) throw new Error("Access token not found");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/get-feedback-by-user`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch feedbacks");
      }

      const data = await response.json();
      setFeedbacks(data.data);
      console.log("Fetched feedbacks:", data.data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err.message);
    }
  };

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

  if (!store) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">No store profile found. Error: {error}</p>
      </div>
    );
  }

  const averageRating =
    feedbacks.length > 0
      ? feedbacks.reduce((sum, feedback) => sum + feedback.feedbackRating, 0) /
        feedbacks.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Avatar className="w-24 h-24 border-4 border-white rounded-full bg-blue-600 shadow-lg mr-6">
                <AvatarImage
                  src={
                    store.avatar?.url || "/placeholder.svg?height=96&width=96"
                  }
                  alt={store.name}
                />
                <AvatarFallback className="text-3xl font-bold text-white">
                  {store.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold">{store.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {renderStars(Math.floor(averageRating))}
                  </div>
                  <span className="ml-2 text-lg">
                    {averageRating.toFixed(1)} ({feedbacks.length} reviews)
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
                onClick={() => navigate("/store/update-profile")}
              >
                Update Profile
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                  <p>{store.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">
                    Contact Number
                  </h3>
                  <p>{store.contactNumber}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">Member Since</h3>
                  <p>
                    {new Date(store.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                    key={feedback._id}
                    className="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-700">
                        {feedback.ratedByID?.name || "Anonymous"}
                      </h3>
                      <div className="flex">
                        {renderStars(feedback.feedbackRating)}
                      </div>
                    </div>
                    <p className="text-gray-600">
                      {feedback.feedbackDescription ||
                        "No description provided."}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
