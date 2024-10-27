import { Input } from "@/components/ui/input";
import heroImage from "../assets/images/hero.jpg";
import { Button } from "@/components/ui/button";
function SendEmail() {
  return (
    <div className="flex h-screen justify-between items-center">
      <img className="w-1/2 h-full" src={heroImage} alt="" />
      <div className="w-1/2 p-10 flex flex-col justify-center gap-6">
        <h1 className="text-3xl font-semibold">Send Email</h1>
        <Input className="w-full mt-4 " placeholder="Email" />
        <Button>Send Email</Button>
      </div>
    </div>
  );
}

export default SendEmail;
