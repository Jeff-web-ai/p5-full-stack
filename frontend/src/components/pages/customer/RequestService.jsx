import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useNavigate } from "react-router-dom";

function RequestService() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    landmark: "",
    address: "",
    date: "",
    details: "",
    image: null,
  });
  const [selectedService, setSelectedService] = useState(null);
  const [availableServices, setAvailableServices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const handleServiceChange = (serviceId) => {
    console.log("Service selected:", serviceId);
    setSelectedService(serviceId);

    const filteredJobs = availableServices
      .flatMap((service) => service.jobID)
      .filter((job) => job.serviceID.includes(serviceId));

    console.log("Filtered Jobs:", filteredJobs);
    setJobs(filteredJobs);
  };

  const handleJobChange = (jobId) => {
    setSelectedJob(jobId);
    console.log("Selected Job:", jobId);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // extact accessToken
        const storedUser = localStorage.getItem("user");
        const { accessToken } = JSON.parse(storedUser);

        const response = await fetch(
          `${import.meta.env.VITE_API_SERVER}/api/v1/get-all-services`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const json = await response.json();
        console.log("Fetched Services:", json.services);

        if (!response.ok) {
          setError(json.message);
        } else {
          setError(null);
          setAvailableServices(json.services);
        }
      } catch (error) {
        if (error.message === "Please login to access this resource") {
          window.location.href = "/login";
        }
      }
    };
    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: files ? files[0] : value,
      };
      console.log("Updated form data:", updatedData);
      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setError("You must be logged in to submit a service request.");
        return;
      }
      const { accessToken } = JSON.parse(storedUser);

      const payload = new FormData();
      payload.append("fullName", formData.name);
      payload.append("email", formData.email);
      payload.append("contactNumber", formData.contact);
      payload.append("landmark", formData.landmark);
      payload.append("address", formData.address);
      payload.append("date", formData.date);
      payload.append("problemDetails", formData.problemDetails);
      payload.append("serviceID", selectedService);
      payload.append("jobID", selectedJob);

      if (formData.image) {
        payload.append("images", formData.image);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/create-request`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: payload,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Service request created successfully.");
        setFormData({
          name: "",
          email: "",
          contact: "",
          landmark: "",
          address: "",
          date: "",
          problemDetails: "",
          image: null,
        });
        setSelectedService("");
        setJobs("");
        setTimeout(() => {
          navigate("/customer", { replace: true });
          window.location.reload(); // Force page reload
        }, 1000);
      } else {
        throw new Error(data.message || "Failed to create service request.");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Book a Request
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Select onValueChange={handleServiceChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Service" />
              </SelectTrigger>
              <SelectContent>
                {availableServices.map((service) => (
                  <SelectItem key={service._id} value={service._id}>
                    {service.serviceName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleJobChange} disabled={!selectedService}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Job" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job._id} value={job._id}>
                    {job.jobName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label>Full Name</Label>
            <Input
              type="text"
              name="name"
              placeholder="Please enter your full name"
              onChange={handleInputChange}
              value={formData.name}
              required
            />
          </div>
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="Please enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label>Contact Number</Label>
            <Input
              type="text"
              name="contact"
              placeholder="Please enter your contact number"
              value={formData.contact}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label>Landmark</Label>
            <Input
              type="text"
              name="landmark"
              placeholder="Please enter near landmark on your address"
              value={formData.landmark}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label>Complete Address</Label>
            <Input
              type="text"
              name="address"
              placeholder="Please enter your complete address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label>Date</Label>
            <Input
              type="date"
              name="date"
              placeholder="Please enter date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label>Request Details</Label>
            <Textarea
              type="text"
              name="problemDetails"
              placeholder="Please state the problem"
              value={formData.problemDetails}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label>Image</Label>
            <Input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              className="w-50 mt-6 bg-indigo-600 rounded-full hover:bg-indigo-700"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>

            <Button
              type="button"
              className="w-50 mt-6 bg-indigo-600 rounded-full hover:bg-indigo-700"
              onClick={() => {
                navigate("/");
              }}
            >
              Cancel
            </Button>
            {message && (
              <p
                className={`mt-4 text-center ${
                  message.includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestService;
