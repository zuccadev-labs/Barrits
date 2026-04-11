import React, { createContext, useContext } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

const AppRouterContext = createContext(null);

const AppRouterContextProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return React.createElement(AppRouterContext.Provider, {
    value: {
      pathname: location.pathname,
      goToMetrics: () => navigate("/metrics"),
      goToHome: () => navigate("/"),
    },
    children,
  });
};

const HomePage = () => React.createElement("p", null, "Context mounted on home route.");
const MetricsPage = () => React.createElement("p", null, "Metrics route reached through AppRouterContext.");

export const AppRouterProvider = ({ children }) => {
  return React.createElement(
    BrowserRouter,
    null,
    React.createElement(
      AppRouterContextProvider,
      null,
      React.createElement("nav", { style: { display: "flex", gap: "0.75rem", marginBottom: "1rem" } }, [
        React.createElement(Link, { key: "home", to: "/" }, "Home"),
        React.createElement(Link, { key: "metrics", to: "/metrics" }, "Metrics"),
      ]),
      React.createElement(Routes, null, [
        React.createElement(Route, { key: "home-route", path: "/", element: React.createElement(HomePage) }),
        React.createElement(Route, { key: "metrics-route", path: "/metrics", element: React.createElement(MetricsPage) }),
      ]),
      children,
    ),
  );
};

export const useAppRouter = () => {
  const value = useContext(AppRouterContext);

  if (!value) {
    throw new Error("useAppRouter must be used inside AppRouterProvider.");
  }

  return value;
};