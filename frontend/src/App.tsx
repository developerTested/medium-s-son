import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "./hooks";

export default function App() {
  const navigate = useNavigate();
  const { loggedIn } = useAppSelector(state => state.auth);

  useEffect(() => {

      if (loggedIn) {
          navigate("/home")
      }

  }, [loggedIn])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-4 m-auto">
        <h1 className="text-9xl font-bold">
          Human <br /> stories & ideas
        </h1>

        <div className="text-2xl">
          A place to read, write, and deepen your understanding
        </div>

        <div className="block">
          <Link to={loggedIn ? "/blogs" : "/auth/login"} className="px-4 py-2 font-bold bg-black text-white rounded-full">
            Start Reading
          </Link>
        </div>
      </div>
    </div>
  )
}