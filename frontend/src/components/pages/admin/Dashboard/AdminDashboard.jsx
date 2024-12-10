import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Wrench,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [totalCustomer, setTotalCustomers] = useState([]);
  const [totalStoreOwners, setTotalStoreOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const { accessToken } = JSON.parse(storedUser);

    const fetchRequests = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_SERVER}/api/v1/get-all-requests`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const json = await response.json();

        setRequests(json.requests);
      } catch (error) {
        setError(err.message);
        if (err.message === "Please login to access this resource") {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCustomer = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_SERVER}/api/v1/get-all-customers`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const json = await response.json();

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch accepted requests"
          );
        }

        setTotalCustomers(json.customers);
      } catch (error) {
        console.error("Error fetching accepted requests:", err.message);
      }
    };

    const fetchStoreOwners = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_SERVER}/api/v1/get-all-store-owners`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const json = await response.json();

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch accepted requests"
          );
        }

        setTotalStoreOwners(json.storeOwners);
      } catch (error) {
        console.error("Error fetching accepted requests:", err.message);
      }
    };

    fetchRequests();
    fetchCustomer();
    fetchStoreOwners();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "open":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "open":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const handleRowClick = (requestId) => {
    navigate(`/store/service/${requestId}`);
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
        <p className="text-red-600">Error loading requests: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader className="bg-green-100">
              <CardTitle className="text-xl flex items-center text-green-800">
                Total Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">
                {totalCustomer.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="bg-blue-100">
              <CardTitle className="text-xl flex items-center text-blue-800">
                Total Store Owners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">
                {totalStoreOwners.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard */}
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <CardTitle className="text-2xl flex items-center">
              <Wrench className="mr-2" />
              Request Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Customer Name</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow
                    key={request._id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(request._id)}
                  >
                    <TableCell>{request.fullName}</TableCell>
                    <TableCell>
                      {request.serviceID?.serviceName || "N/A"}
                    </TableCell>
                    <TableCell className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      {format(new Date(request.date), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`flex items-center w-fit gap-1 ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusIcon(request.status)}
                        {request.status || "Open"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
