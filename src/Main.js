import React, { Fragment, useEffect } from "react";

import DefaultLayout from "./component/layouts/defaultLayout/defaultLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./routes";
import { useTheme } from "./component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "./component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";

function Main() {
  const { theme } = useTheme();
  const { fontSize } = useFontSize();

  useEffect(() => {
    document.body.className = `${theme} ${fontSize}`;
  }, [theme, fontSize]);

  return (
    <Router>
      <div className="Main">
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;

            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}

          {/* Private Routes */}
          {privateRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;

            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default Main;
