import React, { createContext, useState } from "react";
import LoggingService from "../service/logging.service";

export enum ThemeColours {
  "LIGHTMODE" = "LIGHTMODE",
  "DARKMODE" = "DARKMODE",
}
export interface ThemeSelection {
  type: ThemeColours;
}

export interface ThemeState {
  darkMode: boolean;
}
export const ThemeContext = createContext(null as any);

export function ThemeProvider(props: any) {
  const loggingService = LoggingService.getInstance();
  
  const [theme, setTheme] = useState<ThemeColours>(ThemeColours.LIGHTMODE);

  const toggleTheme = () => {
    setTheme((curr: ThemeColours) =>
      curr === ThemeColours.LIGHTMODE
        ? ThemeColours.DARKMODE
        : ThemeColours.LIGHTMODE
    );
  };

  return (
    <ThemeContext.Provider
      value={{ selectedTheme: theme, toggleTheme: toggleTheme }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}
