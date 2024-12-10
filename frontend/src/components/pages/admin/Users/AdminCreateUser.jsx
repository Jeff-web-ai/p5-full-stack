import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus, UserPlus, CircleMinus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useRegister } from "./hooks/useRegister.js";

const AdminCreateUser = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState([]);
  const [formData, setFormData] = useState({
    avatar: null,
    name: "",
    contactNumber: "",
    address: "",
    email: "",
    password: "",
    role: "",
    serviceID: "",
  });

  const { register, error, isLoading } = useRegister();

  useEffect(() => {
    const fetchServices = async () => {
      // Extracting accessToken on localStorage
      const storedUser = localStorage.getItem("user");
      const { accessToken } = JSON.parse(storedUser);

      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/get-all-services`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const json = await response.json();
      if (response.ok) {
        setServices(json.services);
      } else {
        setServices([]);
      }
    };
    fetchServices();
  }, []);

  const addServiceField = () => setSelectedService([...selectedService, ""]);

  const handleServiceChange = (index, value) => {
    const updatedServices = [...selectedService];
    updatedServices[index] = value;
    setSelectedService(updatedServices);
    setFormData((prevData) => ({
      ...prevData,
      serviceID: updatedServices,
    }));
  };

  const removeServiceField = (index) => {
    const updatedServices = selectedService.filter((_, i) => i !== index);
    setSelectedService(updatedServices);
    setFormData((prevData) => ({
      ...prevData,
      serviceID: updatedServices,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prevData) => ({ ...prevData, role }));
    if (role === "customer") {
      setSelectedService([]);
      setFormData((prevData) => ({ ...prevData, serviceID: [] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    const filteredFormData = { ...formData };

    if (formData.role === "customer") {
      delete filteredFormData.serviceID;
    }

    Object.entries(filteredFormData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    await register(formDataToSend);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <main className="container mx-auto py-8">
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <CardTitle className="text-2xl text-center font-bold">
              Create New User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Personal Information section */}
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Personal Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="grid grid-cols-2">
                      <div>
                        <Label>Avatar Picture</Label>
                        <Input
                          type="file"
                          name="avatar"
                          accept="image/*"
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label>Name</Label>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Please enter your full name or store name"
                          onChange={handleInputChange}
                          val
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div>
                        <Label>Contact Number</Label>
                        <Input
                          type="tel"
                          name="contactNumber"
                          placeholder="0912-345-6789"
                          onChange={handleInputChange}
                          value={formData.contactNumber}
                        />
                      </div>
                      <div>
                        <Label>Complete Address</Label>
                        <Input
                          type="text"
                          name="address"
                          placeholder="Street address, Barangay, City, Provice, Postal code"
                          onChange={handleInputChange}
                          value={formData.address}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information  section*/}
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">
                  Account Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="Please enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        name="password"
                        placeholder="Please enter your password"
                        onChange={handleInputChange}
                        value={formData.password}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role and Services Section */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">User Role</h2>
                <RadioGroup
                  defaultValue="store_owner"
                  value={formData.role}
                  onValueChange={handleRoleChange}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="customer" id="customer" />
                      <Label htmlFor="customer">Customer</Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="store_owner" id="store_owner" />
                    <Label htmlFor="store_owner">Store Owner</Label>
                  </div>
                </RadioGroup>

                {formData.role === "store_owner" && (
                  <div className="mt-4">
                    <Label className="block mb-2">Select a Service</Label>
                    {selectedService.map((service, index) => (
                      <div key={index} className="flex items-center mb-2 gap-2">
                        <select
                          value={service}
                          onChange={(e) =>
                            handleServiceChange(index, e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select a Service</option>
                          {services.map((service) => (
                            <option key={service._id} value={service._id}>
                              {service.serviceName}
                            </option>
                          ))}
                        </select>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeServiceField(index)}
                        >
                          <CircleMinus />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" onClick={addServiceField}>
                      <FilePlus className="mr-2" />
                      Add Service
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <Button type="submit" className="px-6 py-2">
                  Create
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminCreateUser;
