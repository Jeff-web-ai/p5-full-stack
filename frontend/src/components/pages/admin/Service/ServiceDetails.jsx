import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const ServiceDetails = () => {
  const [service, setService] = useState({
    jobID: [],
    storeID: [],
    serviceName: "",
  });
  const [error, setError] = useState(null);
  const { serviceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        // Accesstoken
        const storedUser = localStorage.getItem("user");
        const { accessToken } = JSON.parse(storedUser);

        const response = await fetch(
          `${
            import.meta.env.VITE_API_SERVER
          }/api/v1/get-single-service/${serviceId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const json = await response.json();

        if (!response.ok) {
          setError(json.message);
        } else {
          setError(null);
          setService(json.service);
        }
      } catch (error) {
        if (error.message === "Please login to access this resource") {
          window.location.href = "/login";
        }
      }
    };

    fetchService();
  }, [serviceId]);

  const handleDelete = async (serviceID) => {
    try {
      // Accesstoken
      const storedUser = localStorage.getItem("user");
      const { accessToken } = JSON.parse(storedUser);

      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/delete-service/${serviceID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setError(json.message);
      } else {
        setError(null);
        navigate("/admin/services");
      }
    } catch (error) {
      if (error.message === "Please login to access this resource") {
        window.location.href = "/login";
      }
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <main className="container mx-auto py-8">
        <Card className="mb-10">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <div className="flex justify-between items-center">
              <div>
                <Button size="icon" onClick={() => navigate("/admin/services")}>
                  <ArrowLeft />
                </Button>
              </div>
              <div>
                <CardTitle className="text-2xl text-center font-bold py-2">
                  Service Details
                </CardTitle>
              </div>
              <div className="space-x-4">
                <Button
                  onClick={() => navigate(`/admin/update-service/${serviceId}`)}
                >
                  Update
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(serviceId)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <h2 className="text-3xl font-semibold text-gray-800 mt-4">
                {service.serviceName}
              </h2>
              <Tabs defaultValue="jobs" className="w-full">
                <TabsList className="grid grid-cols-2 gap-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-400 text-white ">
                  <TabsTrigger
                    value="jobs"
                    className="font-medium rounded-md hover:shadow-lg transition-shadow"
                  >
                    Jobs
                  </TabsTrigger>
                  <TabsTrigger
                    value="store-owners"
                    className="font-medium rounded-md hover:shadow-lg transition-shadow"
                  >
                    Store Owners
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="jobs" className="mt-6 space-y-4">
                  <Card className="bg-gray-50 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        Jobs
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        List of Jobs are related on this Service
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {service.jobID.length === 0 ? (
                        <p className="text-gray-600 text-center">
                          No Jobs available.
                        </p>
                      ) : (
                        service.jobID.map((job) => (
                          <Card
                            key={job._id}
                            className="bg-white shadow-md rounded-md p4 hover:shadow-xl transition-shadow"
                          >
                            <CardHeader>
                              <CardTitle className="text-lg font-semibold text-gray-800">
                                {job.jobName}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <CardDescription className="text-gray-600">
                                {job.jobDescription}
                              </CardDescription>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="store-owners" className="mt-6 space-y-4">
                  <Card className="bg-gray-50 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        Store Owners
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        List of Store Owners are related on this Service
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {service.storeID.length === 0 ? (
                        <p className="text-gray-600 text-center">
                          No Store Owners available.
                        </p>
                      ) : (
                        service.storeID.map((store) => (
                          <Card
                            key={store._id}
                            className="bg-white shadow-md rounded-md p4 hover:shadow-xl transition-shadow"
                          >
                            <CardHeader>
                              <CardTitle className="text-lg font-semibold text-gray-800">
                                {store.name}
                              </CardTitle>
                            </CardHeader>
                          </Card>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </Card>
      </main>
    </div>
  );
};

export default ServiceDetails;
