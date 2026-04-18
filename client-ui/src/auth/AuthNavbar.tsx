import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function AuthNavbar() {
  const navigate = useNavigate();
  const home = () => {
    navigate("/")
  }

  return (
    <div className="h-15 flex items-center shadow-sm justify-between p-3 md:px-12 bg-card">
        <img 
        src="https://res.cloudinary.com/ddddb62xl/image/upload/v1775941345/uploadimage/run26qggkvu1bthkzq0v.png" alt="" 
        className="h-full cursor-pointer"
        onClick={home}
        />
        <Button variant='outline' className="border-none shadow-none">
          <Link to='/' className="flex items-center justify-center gap-2"><Home/> Home</Link>
        </Button>
    </div>
  )
}