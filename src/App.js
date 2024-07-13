import React from "react";

import { UserProvider } from "../src/component/contexts/UserContext";
import { LanguageProvider } from "./component/layouts/defaultLayout/header/Settings/Context/LanguageContext";
import { FontSizeProvider } from "./component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";
import { ThemeProvider } from "./component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import Main from "./Main";

function App() {
  return (
    <UserProvider>
        <ThemeProvider>
          <LanguageProvider>
            <FontSizeProvider>
              <div className="App">
                <Main />
              </div>
            </FontSizeProvider>
          </LanguageProvider>
        </ThemeProvider>
    </UserProvider>
  );
}

export default App;
