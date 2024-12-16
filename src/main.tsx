import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Link,
  Outlet,
  RouterProvider,
  createHashRouter,
  Navigate,
} from "react-router-dom";

import "./index.css";
import "./styles/print.css"; // Import print styles
import TimersView from "./views/TimersView";
import DocumentationView from "./views/DocumentationView";
import LoginView from "./views/LoginView";
import RosterView from "./views/RosterView";

const PageLayout = () => {
  return (
    <div>
      <nav className="bg-gray-800 p-4 print:hidden">
        <ul className="flex space-x-4 text-white">
          <li>
            <Link to="/roster" className="hover:text-gray-300">Roster Management</Link>
          </li>
          <li>
            <Link to="/docs" className="hover:text-gray-300">Documentation</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

const router = createHashRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginView />,
  },
  {
    path: "/",
    element: <PageLayout />,
    children: [
      {
        path: "roster",
        element: <RosterView />,
      },
      {
        path: "docs",
        element: <DocumentationView />,
      },
    ],
  },
]);

// biome-ignore lint/style/noNonNullAssertion: root html element is there
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
