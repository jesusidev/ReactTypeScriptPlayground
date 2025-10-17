import React, { createContext } from "react";

export type Theme = "light" | "dark";
export type ThemeContextValue = { theme: Theme; toggle: () => void };

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);
