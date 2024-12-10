import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserRoundPlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminCustomerDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const { accessToken } = JSON.parse(storedUser);

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
        console.log(json);

        if (!response.ok) {
          setError(json.message);
        } else {
          setError(null);
          setCustomers(json.customers);
        }
      } catch (error) {
        if (error.message === "Please login to access this resource") {
          window.location.href = "/login";
        }
      }
    };

    fetchCustomers();
  }, []);

  const handleRowClick = (customerId) => {
    navigate(`/admin/view-customer/${customerId}`);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <main className="container mx-auto py-8">
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <CardTitle className="text-2xl flex items-center justify-between">
              <div className="flex items-center">
                <User size={36} className="mr-2" />
                Customer Dashboard
              </div>
              <Button onClick={() => navigate("/admin/create-user")}>
                <UserRoundPlus />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="mt-2">
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <p className="text-gray-600 text-center">
                    No Customer available.
                  </p>
                ) : (
                  customers.map((customer) => (
                    <TableRow
                      key={customer._id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(customer._id)}
                    >
                      <TableCell className="flex items-center font-medium">
                        <Avatar className="mr-4">
                          <AvatarImage
                            src={customer.avatar?.url}
                            alt={customer.name}
                          />
                          <AvatarFallback>{customer.name[0]}</AvatarFallback>
                        </Avatar>
                        {customer.name}
                      </TableCell>
                      <TableCell className="font-medium">
                        {customer.email}
                      </TableCell>
                      <TableCell className="font-medium">
                        {customer.contactNumber}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </Card>
      </main>
    </div>
  );
};

export default AdminCustomerDashboard;
