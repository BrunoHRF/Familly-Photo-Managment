import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import UserPage from "./views/pages/UserPage";
import AlbumsPage from "./views/pages/AlbumsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserPage />,
  },
  {
    path: "/albums/:userId",
    element: <AlbumsPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
