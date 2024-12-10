import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FilePlus, UserPlus, CircleMinus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const UpdateService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [serviceName, setServiceName] = useState("");
  const [availableJobs, setAvailableJobs] = useState([]);
  const [availableStores, setAvailableStores] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const { accessToken } = JSON.parse(storedUser);
    const fetchServiceDetails = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_SERVER
          }/api/v1/get-single-service/${serviceId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const json = await response.json();
        if (!response.ok) {
          setError(json.message);
        } else {
          setError(null);
          setServiceName(json.service.serviceName);
          setSelectedJobs(json.service.jobID.map((job) => job._id));
          setSelectedStores(json.service.storeID.map((store) => store._id));
        }
      } catch (error) {
        if (error.message === "Please login to access this resource") {
          window.location.href = "/login";
        }
      }
    };

    const fetchOptions = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser)
          throw new Error("Please login to access this resource");

        const { accessToken } = JSON.parse(storedUser);
        const [jobsRes, storesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_SERVER}/api/v1/get-all-jobs`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          fetch(
            `${import.meta.env.VITE_API_SERVER}/api/v1/get-all-store-owners`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          ),
        ]);

        if (!jobsRes.ok || !storesRes.ok) {
          throw new Error("Failed to fetch options");
        }
        const jobs = await jobsRes.json();
        const stores = await storesRes.json();

        setAvailableJobs(jobs.jobs);
        setAvailableStores(stores.storeOwners);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchOptions();
    fetchServiceDetails();
  }, [serviceId]);

  const addJobField = () => setSelectedJobs([...selectedJobs, ""]);
  const addStoreField = () => setSelectedStores([...selectedStores, ""]);

  const handleJobChange = (index, value) => {
    const updatedJobs = [...selectedJobs];
    updatedJobs[index] = value;
    setSelectedJobs(updatedJobs);
  };
  const handleStoreChange = (index, value) => {
    const updatedStores = [...selectedStores];
    updatedStores[index] = value;
    setSelectedStores(updatedStores);
  };

  const removeJobField = (index) => {
    const updatedJobs = selectedJobs.filter((_, i) => i !== index);
    setSelectedJobs(updatedJobs);
  };
  const removeStoreField = (index) => {
    const updatedStores = selectedStores.filter((_, i) => i !== index);
    setSelectedStores(updatedStores);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serviceData = {
      serviceName,
      jobID: selectedJobs.filter(Boolean),
      store: selectedStores.filter(Boolean),
    };

    const storedUser = localStorage.getItem("user");
    const { accessToken } = JSON.parse(storedUser);

    const response = await fetch(
      `${import.meta.env.VITE_API_SERVER}/api/v1/add-service`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(serviceData),
      }
    );

    const json = await response.json();
    if (!response.ok) {
      setError(json.message);
    } else {
      setError(null);
      navigate("/admin/services");
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <main className="container mx-auto py-8">
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <CardTitle className="text-2xl text-center font-bold">
              Update Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="jobName" className="block mb-2">
                  Service Name
                </Label>
                <Input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <Label className="block mb-2">Jobs</Label>
                {selectedJobs.map((job, index) => (
                  <div key={index} className="flex items-center mb-2 gap-2">
                    <select
                      value={job}
                      onChange={(e) => handleJobChange(index, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select a Job</option>
                      {availableJobs.map((job) => (
                        <option key={job._id} value={job._id}>
                          {job.jobName}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeJobField(index)}
                    >
                      <CircleMinus />
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addJobField}>
                  <FilePlus />
                </Button>
              </div>

              <div>
                <Label className="block mb-2">Store Owners</Label>
                {selectedStores.map((store, index) => (
                  <div key={index} className="flex items-center mb-2 gap-2">
                    <select
                      value={store}
                      onChange={(e) => handleStoreChange(index, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select a Store</option>
                      {availableStores.map((store) => (
                        <option key={store._id} value={store._id}>
                          {store.name}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeStoreField(index)}
                    >
                      <CircleMinus />
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addStoreField}>
                  <UserPlus />
                </Button>
              </div>

              <div className="flex justify-center gap-4">
                <Button type="submit">Update Service</Button>
                <Button
                  type="button"
                  onClick={() => window.history.back()}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UpdateService;
