import BASE_URL from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UpdateUserForm from "./components/UserForm";

export default function EditProfile() {
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
        <div>
            <UpdateUserForm editData={user} />
        </div>
    )
}