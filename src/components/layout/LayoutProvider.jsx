import React from "react";

export const layoutType = {
    showLayout: true,
}

export const LayoutContext = React.createContext({
    theme: layoutType.showLayout,
    toggleTheme: () => {},
    promptToInstall: () => {},
});