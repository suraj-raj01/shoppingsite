import { useEffect, useState } from "react";
import UserForm from "./components/userForm";
import BASE_URL from "@/Config";
import axios from "axios";
import { useParams } from "react-router-dom";

export function Register() {
  const [user, setUser] = useState<any>(null);
  const { id } = useParams();
  const loadUser = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/customers/${id}`
      );
      setUser(res.data.data); // ✅ important fix
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);
  return (
    <div className="max-w-xl p-2 md:p-0 mx-auto mt-10">
      <UserForm editData={user} />
    </div>
  )
}
