import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Store, UserRoundPlus } from "lucide-react";
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

const AdminStoreDashboard = () => {
  const [storesOwners, setStoresOwners] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoresUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const { accessToken } = JSON.parse(storedUser);

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
        console.log(json);

        if (!response.ok) {
          setError(json.message);
        } else {
          setError(null);
          setStoresOwners(json.storeOwners);
        }
      } catch (error) {
        if (error.message === "Please login to access this resource") {
          window.location.href = "/login";
        }
      }
    };
    fetchStoresUser();
  }, []);

  const handleRowClick = (storeId) => {
    navigate(`/admin/view-store/${storeId}`);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <main className="container mx-auto py-8">
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <CardTitle className="text-2xl flex items-center justify-between">
              <div className="flex items-center">
                <Store size={36} className="mr-2" />
                Store Owners Dashboard
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
                  <TableHead>Store Name</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Total Service Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storesOwners.length === 0 ? (
                  <p className="text-gray-600 text-center">
                    No Store Owner available.
                  </p>
                ) : (
                  storesOwners.map((store) => (
                    <TableRow
                      key={store._id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(store._id)}
                    >
                      <TableCell className="flex items-center font-medium">
                        <Avatar className="mr-4">
                          <AvatarImage
                            src={store.avatar?.url}
                            alt={store.name}
                          />
                          <AvatarFallback>{store.name[0]}</AvatarFallback>
                        </Avatar>
                        {store.name}
                      </TableCell>
                      <TableCell className="font-medium">
                        {store.serviceID?.serviceName || "No Service"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {store.serviceLogID?.length || 0}
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

export default AdminStoreDashboard;
