import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../providers/ThemeProvider";
import "./themeSelector.scss";

export default function ThemeSelector() {
  const theme = useContext(ThemeContext);
  return (
    <div className="outer">
      <div
        className={`${theme.selectedTheme}-circle circle`}
        onClick={theme.toggleTheme}
      >
        &nbsp;
      </div>
    </div>
  );
}
