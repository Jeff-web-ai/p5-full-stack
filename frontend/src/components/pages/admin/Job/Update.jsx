import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FilePlus, UserPlus, CircleMinus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const Update = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [jobName, setJobName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [existingService, setExistingService] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Extracting accessToken on localStorage
    const storedUser = localStorage.getItem("user");
    const { accessToken } = JSON.parse(storedUser);

    const fetchServices = async () => {
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

    const fetchJobDetails = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/get-single-job/${jobId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const json = await response.json();
      console.log(json);
      if (!response.ok) {
        setError(json.message);
      } else {
        setJobName(json.job.jobName);
        setJobDescription(json.job.jobDescription);
        setSelectedService(json.job.serviceID.map((service) => service._id));
        setExistingService(json.job.serviceID[0].serviceName);
      }
    };
    fetchJobDetails();
    fetchServices();
  }, []);

  const addServiceField = () => setSelectedService([...selectedService, ""]);

  const handleServiceChange = (index, value) => {
    const updatedServices = [...selectedService];
    updatedServices[index] = value;
    setSelectedService(updatedServices);
  };

  const removeServiceField = (index) => {
    const updatedServices = selectedService.filter((_, i) => i !== index);
    setSelectedService(updatedServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobData = {
      jobName,
      jobDescription,
      serviceID: selectedService.filter(Boolean),
    };

    const storedUser = localStorage.getItem("user");
    const { accessToken } = JSON.parse(storedUser);

    const response = await fetch(
      `${import.meta.env.VITE_API_SERVER}/api/v1/update-job/${jobId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(jobData),
      }
    );

    const json = await response.json();
    if (!response.ok) {
      setError(json.message);
    } else {
      navigate("/admin/jobs");
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <main className="container mx-auto py-8">
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <CardTitle className="text-2xl text-center font-bold">
              Update Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
              <Label htmlFor="jobName" className="block mb-2">
                Job Name
              </Label>
              <Input
                type="text"
                onChange={(e) => setJobName(e.target.value)}
                value={jobName}
              />
              <Label htmlFor="jobDescription" className="block mb-2">
                Job Description
              </Label>
              <Textarea
                onChange={(e) => setJobDescription(e.target.value)}
                value={jobDescription}
              />

              <Label className="block mb-2">
                Existing Service:{" "}
                <span className="text-blue-600 text-base">
                  {existingService}
                </span>
              </Label>

              <div>
                <Label className="block mb-2">Select a Service: </Label>
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
                  <FilePlus />
                </Button>
              </div>

              <div className="flex justify-center gap-4">
                <Button type="submit">Update</Button>
                <Button
                  onClick={() => navigate("/admin/jobs")}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
            {error && (
              <div className="text-red-500 mt-4 flex items-center justify-center">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Update;
