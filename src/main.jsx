import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Offer from "./pages/Offer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import Category from "./pages/Category.jsx";
import EditListing from "./pages/EditListing.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/offer",
        element: <Offer />,
      },
      {
        path: "/create-listing",
        element: (
          <ProtectedRoute>
            <CreateListing />
          </ProtectedRoute>
        ),
      },
      {
        path: "/category/:categoryName/:listingId",
        element: <Category />
      },
      {
        path: "/edit-listing/:listingID",
        element: (
          <ProtectedRoute>
            <EditListing />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
