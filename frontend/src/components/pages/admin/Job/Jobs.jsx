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
import { Wrench, Trash2, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const handleClickAdd = () => {
    navigate("/admin/create-job");
  };

  const handleClickUpdate = (jobId) => {
    navigate(`/admin/update-job/${jobId}`);
  };

  const handleClickDelete = async (jobId) => {
    try {
      const storedUser = localStorage.getItem("user");
      const { accessToken } = JSON.parse(storedUser);
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/delete-job/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const json = response.json();
      if (!response.ok) {
        alert(json.message);
        return;
      }

      alert("Job deleted successfully");
      fetchJobs();
    } catch (error) {
      if (error.message === "Please login to access this resource") {
        window.location.href = "/login";
      }
    }
  };

  const fetchJobs = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const { accessToken } = JSON.parse(storedUser);
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/get-all-jobs`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        setError(json.message);
      }
      setJobs(json.jobs);
    } catch (error) {
      console.error("Error fetching jobs", error.message);
      if (error.message === "Please login to access this resource") {
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-full bg-gray-50">
      <main className="container mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <CardTitle className="text-2xl flex items-center justify-between">
              <div className="flex items-center">
                <Wrench className="mr-2" />
                Jobs Dashboard
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
                  <TableHead>Job Name</TableHead>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow
                    key={job._id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <TableCell className="font-medium">{job.jobName}</TableCell>
                    <TableCell className="font-medium">
                      {job.serviceID.map((service) => service.serviceName)}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button onClick={() => handleClickUpdate(job._id)}>
                        Update
                      </Button>
                      <Button
                        onClick={() => handleClickDelete(job._id)}
                        variant="destructive"
                      >
                        <Trash2 />
                      </Button>
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

export default Jobs;
