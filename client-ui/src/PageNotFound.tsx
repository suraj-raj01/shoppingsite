import { Link } from "react-router-dom"
import { Button } from "./components/ui/button"

type PageNotFoundProps = {
  url?: string
}

export default function PageNotFound({ url = "/" }: PageNotFoundProps) {
  return (
    <div className="px-4 min-h-screen md:min-h-160 flex flex-col items-center justify-center">
      <h1 className="md:text-4xl text-2xl font-bold text-center">
        😵 404 - Page Not Found
      </h1>

      <p className="text-center mt-1 text-gray-600">
        The page you are looking for does not exist.
      </p>

      <div className="flex items-center justify-center">
        <Button className="mt-6" variant='destructive'>
          <Link to={url} className="px-4 py-2">
            Go to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}