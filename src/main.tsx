import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createHashRouter,
  Navigate,
} from "react-router-dom";

import "./index.css";
import "./styles/print.css";
import "./styles/animations.css";

import { AppProvider } from "./contexts/AppContext";
import AppLayout from "./components/layout/AppLayout";
import LoginView from "./views/LoginView";
import DefaultError from "./components/common/DefaultError";
import LoadingScreen from "./components/common/LoadingScreen";
import { withAuth } from "./hocs/withAuth";
import { withRouteLoader } from "./components/common/RouteLoader";

// Lazy load route components
const OfficersView = lazy(() => import("./views/OfficersView"));
const RosterView = lazy(() => import("./views/RosterView"));
const DocumentationView = lazy(() => import("./views/DocumentationView"));

// Wrap components with auth and loading
const ProtectedOfficersView = withRouteLoader(OfficersView, {
  requireAuth: true,
  loadingMessage: "Loading officer management..."
});

const ProtectedRosterView = withRouteLoader(withAuth(RosterView), {
  requireAuth: true,
  loadingMessage: "Loading roster management..."
});

const ProtectedDocumentationView = withRouteLoader(withAuth(DocumentationView), {
  requireAuth: true,
  loadingMessage: "Loading documentation..."
});

const router = createHashRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
    errorElement: <DefaultError />,
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingScreen message="Loading login..." />}>
        <LoginView />
      </Suspense>
    ),
    errorElement: <DefaultError />,
  },
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <DefaultError />,
    children: [
      {
        path: "officers",
        element: <ProtectedOfficersView />,
      },
      {
        path: "roster",
        element: <ProtectedRosterView />,
      },
      {
        path: "docs",
        element: <ProtectedDocumentationView />,
      },
      // Catch-all redirect to officers page
      {
        path: "*",
        element: <Navigate to="/officers" replace />,
      },
    ],
  },
]);

// Add dark mode class based on system preference
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark');
}

// Watch for system dark mode changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (e.matches) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

// Add custom styles
const style = document.createElement('style');
style.textContent = `
  :root {
    --color-police-yellow: #FFD700;
    --color-police-black: #000000;
    --color-police-gold: #FFB700;

    /* Light mode colors */
    --color-bg-primary: #ffffff;
    --color-bg-secondary: #f3f4f6;
    --color-text-primary: #111827;
    --color-text-secondary: #4b5563;
    --color-border: #e5e7eb;
  }

  /* Dark mode colors */
  .dark {
    --color-bg-primary: #1f2937;
    --color-bg-secondary: #111827;
    --color-text-primary: #f9fafb;
    --color-text-secondary: #d1d5db;
    --color-border: #374151;
  }

  body {
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-bg-secondary);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-police-yellow);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-police-gold);
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid var(--color-police-yellow);
    outline-offset: 2px;
  }

  /* Selection styles */
  ::selection {
    background-color: var(--color-police-yellow);
    color: var(--color-police-black);
  }

  /* Button hover effects */
  .hover-effect {
    transition: all 0.3s ease;
  }

  .hover-effect:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
  }

  /* Card styles */
  .card {
    background-color: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s ease;
  }

  .card:hover {
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.15);
  }

  /* Form control focus styles */
  .form-control:focus {
    border-color: var(--color-police-yellow);
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }

  /* Badge styles */
  .badge {
    background-color: var(--color-police-yellow);
    color: var(--color-police-black);
    font-weight: 600;
  }

  /* Print styles */
  @media print {
    .print\\:hidden {
      display: none !important;
    }
  }

  /* Loading animation */
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }
`;

document.head.appendChild(style);

// biome-ignore lint/style/noNonNullAssertion: root html element is there
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>
);
