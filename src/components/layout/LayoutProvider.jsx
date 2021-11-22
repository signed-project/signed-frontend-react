import React from "react";

export const layoutType = {
    showLayout: true,
}

const ThemeContext = React.createContext({
    theme: layoutType.showLayout,
    toggleTheme: () => {},
    promptToInstall: () => {},
});

export default ThemeContext;