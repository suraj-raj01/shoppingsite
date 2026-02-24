import { useParams } from "react-router-dom"

export default function ProductViewPage() {
  const {id} = useParams();
  return (
    <div>
     PRODUCTS VIEW ID - {id}
    </div>
  )
}

