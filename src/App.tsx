import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import UserPage from "./views/pages/UserPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserPage/>
  },
]);

export default function App(){
  return <RouterProvider router={router}/>
}