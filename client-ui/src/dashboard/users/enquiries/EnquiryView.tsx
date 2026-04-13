import BASE_URL from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EnquiryView(){
    const [enquiry, setEnquiry] = useState<any>(null);

    const {id} = useParams();

    const fetchEnquiry = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/enquiry/${id}`);
            setEnquiry(res.data.data);
        } catch (err) {
            console.log(err);
        }   
    };

    useEffect(() => {
        fetchEnquiry();
    }, []);


    return(
        <div className="p-3">
            <pre>
                {JSON.stringify(enquiry, null, 2)}
            </pre>
        </div>
    )
}