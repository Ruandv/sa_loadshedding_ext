import React, { createContext, useEffect, useState } from "react";
import { StorageKeys } from "../enums/storageKeys";
import StorageService from "../service/storage.service";

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
  const storageService = StorageService.getInstance();

  const [theme, setTheme] = useState<ThemeColours>();

  const toggleTheme = () => {
    setTheme((curr: ThemeColours | undefined) =>
      (!curr || curr === ThemeColours.LIGHTMODE)
        ? ThemeColours.DARKMODE
        : ThemeColours.LIGHTMODE
    );
  };

  useEffect(() => {
    storageService.saveData(StorageKeys.darkMode, theme);
  }, [theme]);

  useEffect(() => {
    storageService.getData(StorageKeys.darkMode).then((x) => {
      setTheme(x);
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{ selectedTheme: theme, toggleTheme: toggleTheme }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}
