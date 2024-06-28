import React, { Fragment } from "react";

import DefaultLayout from "./component/layouts/defaultLayout/defaultLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./routes";
import { UserProvider } from "../src/component/contexts/UserContext";

import { LanguageProvider } from "./component/layouts/defaultLayout/header/Settings/Context/LanguageContext";
import { ThemeProvider } from "./component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <div className="App">
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
        </LanguageProvider>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
