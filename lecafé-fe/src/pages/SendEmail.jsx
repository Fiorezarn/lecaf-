import { Input } from "@/components/ui/input";
import heroImage from "../assets/images/hero.jpg";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
function SendEmail() {
  const [loading, setLoading] = useState(false);
  const queryParams = new URLSearchParams(window.location.search);
  const action = queryParams.get("action");
  const BASE_URL = import.meta.env.VITE_BASE_URL_BE;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    try {
      const response = await fetch(
        `${BASE_URL}/auth/${
          action === "verify-email" ? "send-email" : "send-forgot-password"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();
      setLoading(false);
      if (result.code !== 200) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    } catch (error) {
      console.error("Error during send email:", error);
    }
  };

  return (
    <div className="flex h-screen justify-between items-center">
      <img className="w-1/2 h-full" src={heroImage} alt="" />
      <div className="w-1/2 p-10 flex flex-col justify-center gap-6">
        <h1 className="text-3xl font-semibold">
          {action === "verify-email" ? "Verify Email" : "Forgot your password?"}
        </h1>
        <p>
          {action === "verify-email"
            ? "Enter the email address associated with your account, and we'll send you a link to verify your email"
            : "Enter the email address associated with your account, and we'll send you a link to reset your password"}
        </p>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Input
            id="email"
            className="w-full mt-4 "
            type="email"
            placeholder="Email"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Send Email"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SendEmail;
