import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { useSignup } from "@/hooks/useSignup.js";
import heroBackground from "@/components/homepage/herobackground.png";

function Registration() {
  const [formData, setFormData] = useState({
    avatar: null,
    name: "",
    contactNumber: "",
    address: "",
    email: "",
    password: "",
  });

  const { signup, error, isLoading } = useSignup();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    await signup(formDataToSend);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${heroBackground})`,
      }}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 m-4">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Sign up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="avatar"
              className="text-sm font-medium text-gray-700"
            >
              Profile Picture
            </Label>
            <Input
              id="avatar"
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full mt-1"
            />
          </div>
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Please enter your full name"
              onChange={handleInputChange}
              value={formData.name}
              className="w-full mt-1"
            />
          </div>
          <div>
            <Label
              htmlFor="contactNumber"
              className="text-sm font-medium text-gray-700"
            >
              Contact Number
            </Label>
            <Input
              id="contactNumber"
              type="tel"
              name="contactNumber"
              placeholder="0912-345-6789"
              onChange={handleInputChange}
              value={formData.contactNumber}
              className="w-full mt-1"
            />
          </div>
          <div>
            <Label
              htmlFor="address"
              className="text-sm font-medium text-gray-700"
            >
              Complete Address
            </Label>
            <Input
              id="address"
              type="text"
              name="address"
              placeholder="Street address, Barangay, City, Province, Postal code"
              onChange={handleInputChange}
              value={formData.address}
              className="w-full mt-1"
            />
          </div>
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Please enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mt-1"
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Please enter your password"
              onChange={handleInputChange}
              value={formData.password}
              className="w-full mt-1"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white py-2 mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>
        {error && (
          <div className="text-red-500 text-center text-sm mt-4">{error}</div>
        )}
      </div>
    </div>
  );
}

export default Registration;
