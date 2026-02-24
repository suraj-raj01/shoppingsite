import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function AuthNavbar() {
  const navigate = useNavigate();
  const home = () => {
    navigate("/")
  }

  return (
    <div className="h-15 flex items-center justify-between p-3 md:px-12 bg-gray-100">
        <img 
        src="https://res.cloudinary.com/ddddb62xl/image/upload/v1771530926/uploadimage/bn8cqhqrpjr11cs07lse.png" alt="" 
        className="h-full"
        onClick={home}
        />
        <Button variant='outline' className="border-none shadow-none hover:bg-background">
          <Link to='/' className="flex items-center justify-center gap-2"><Home/> Home</Link>
        </Button>
    </div>
  )
}