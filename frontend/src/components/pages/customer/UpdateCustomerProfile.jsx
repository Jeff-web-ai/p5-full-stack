import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";

export default function UpdateCustomerProfile() {
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
        throw new Error(errorData.message || "Failed to fetch store profile");
      }

      const data = await response.json();
      setCustomer(data.user);
    } catch (err) {
      setError(err.message);
      if (err.message === "Please login to access this resource") {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Profile update submitted");

    navigate("/customer-profile");
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
        <p className="text-red-600">Error loading customer profile: {error}</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">No customer profile found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between space-x-4">
          <Button
            variant="outline"
            className="mb-6 border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => navigate("/customer/profile")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>

          <Button
            variant="outline"
            className="mb-6 border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => navigate("/customer/profile/change-password")}
          >
            Change Password
            <ChevronRight className="mr-2 h-4 w-4" />
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <CardTitle className="text-2xl">Update Customer Profile</CardTitle>
          </CardHeader>
          <CardContent className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={customer.avatar?.url} alt={customer.name} />
                  <AvatarFallback>{customer.name[0]}</AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline">
                  Change Avatar
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Customer Name</Label>
                <Input id="name" defaultValue={customer.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={customer.email} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  defaultValue={customer.contactNumber}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" defaultValue={customer.address || ""} />
              </div>

              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
