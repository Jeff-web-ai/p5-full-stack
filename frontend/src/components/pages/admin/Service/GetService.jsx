import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wrench, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GetService = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser)
          throw new Error("Please login to access this resource");

        const { accessToken } = JSON.parse(storedUser);
        if (!accessToken) throw new Error("Access token not found");

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

        if (!response.ok) {
          setError(json.message);
        } else {
          setError(null);
          setServices(json.services);
        }
      } catch (error) {
        if (error.message === "Please login to access this resource") {
          window.location.href = "/login";
        }
      }
    };

    fetchServices();
  }, []);

  const handleClickAdd = () => {
    navigate("/admin/create-service");
  };

  const handleRowClick = (servicesId) => {
    navigate(`/admin/view-service/${servicesId}`);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <main className="container mx-auto py-8">
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <CardTitle className="text-2xl flex items-center justify-between">
              <div className="flex items-center">
                <Wrench className="mr-2" />
                Services Dashboard
              </div>
              <Button onClick={handleClickAdd}>
                <FilePlus />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="mt-2">
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Number of Jobs</TableHead>
                  <TableHead>Number of Store Owners</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow
                    key={service._id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(service._id)}
                  >
                    <TableCell className="font-medium">
                      {service.serviceName}
                    </TableCell>
                    <TableCell className="font-medium">
                      {service.jobID?.length || 0}
                    </TableCell>
                    <TableCell className="font-medium">
                      {service.store?.length || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </Card>
      </main>
    </div>
  );
};

export default GetService;
