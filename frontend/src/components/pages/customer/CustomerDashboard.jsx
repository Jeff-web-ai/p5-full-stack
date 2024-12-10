import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Calendar, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CustomerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleRowClick = (serviceId) => {
    navigate(`/customer/detail/${serviceId}`);
  };

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser)
          throw new Error("Please login to access this resource");

        const { accessToken } = JSON.parse(storedUser);
        if (!accessToken) throw new Error("Access token not found");

        const response = await fetch(
          `${import.meta.env.VITE_API_SERVER}/api/v1/get-users-request`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch services");
        }

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          setError(data.message);
        } else {
          setError(null);
          setRequests(data.requests);
        }
      } catch (error) {
        console.error("Error fetching services", error.message);
        if (error.message === "Please login to access this resource") {
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserRequests();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase().trim()) {
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "In-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "open":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center">
            <User className="mr-2" />
            Customer Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Service</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow
                  key={request._id}
                  onClick={() => handleRowClick(request._id)}
                >
                  <TableCell className="cursor-pointer transition-colors hover:bg-gray-100">
                    {request.serviceID?.serviceName || "N/A"}
                  </TableCell>
                  <TableCell>{request.jobID?.jobName || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(request.status)}
                    >
                      {request.status || "Open"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    {request.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
