import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setMessageType("error");
        setMessage("You must be logged in to change your password.");
        return;
      }
      const { accessToken } = JSON.parse(storedUser);

      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/update-user-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessageType("success");
        setMessage("Your password has been updated successfully.");
        setOldPassword("");
        setNewPassword("");
        setTimeout(() => {
          navigate(-2);
        }, 1000);
      } else {
        throw new Error(data.message || "Unable to update password.");
      }
    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="max-w-2xl w-full">
        <div className="flex items-center justify-between space-x-4 p-4">
          <Button
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => navigate("/customer/profile")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </div>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
          <CardTitle className="text-2xl">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="mt-6">
          <form className="space-y-6" onSubmit={handleChangePassword}>
            <div className="space-y-2">
              <Label htmlFor="old-password">Old Password</Label>
              <div className="relative">
                <Input
                  id="old-password"
                  type={oldPasswordVisible ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter your old password"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOldPasswordVisible(!oldPasswordVisible)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {oldPasswordVisible ? "Hide" : "Show"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={newPasswordVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a new password"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {newPasswordVisible ? "Hide" : "Show"}
                </Button>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>

            {message && (
              <p
                className={`text-sm mt-2 ${
                  messageType === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
