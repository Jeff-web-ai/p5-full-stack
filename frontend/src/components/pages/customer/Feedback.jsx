"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Feedback() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ratingNum = Number(rating);
    if (ratingNum < 1 || ratingNum > 5 || isNaN(ratingNum)) {
      setMessage("Please enter a rating between 1 and 5");
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) throw new Error("Please login to access this resource");

      const { accessToken } = JSON.parse(storedUser);
      if (!accessToken) throw new Error("Access token not found");

      const response = await fetch(
        `${
          import.meta.env.VITE_API_SERVER
        }/api/v1/attach-feedback-to-request/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            feedbackDescription: feedback,
            feedbackRating: rating,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        setError(data.message);
        console.log(data.message);
        return;
      }

      const completeRequestResponse = await fetch(
        `${
          import.meta.env.VITE_API_SERVER
        }/api/v1/complete-request/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const completeRequestData = await completeRequestResponse.json();

      if (!completeRequestResponse.ok) {
        setError(completeRequestData.message);
        console.log(completeRequestData.message);
        return;
      }

      setMessage(
        "Feedback submitted successfully and request marked as completed."
      );
      console.log(completeRequestData.message);

      setRating("");
      setFeedback("");
      navigate("/customer");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-primary">
            Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="rating">Rate your experience 1 to 5</Label>
              <Input
                name="feedbackRating"
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Enter a number between 1 and 5"
                className="max-w-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">
                Tell us more about the experience
              </Label>
              <Textarea
                name="feedbackDescription"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts..."
                className="min-h-[100px]"
              />
            </div>
            <Button type="submit" className="w-full">
              Send Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
