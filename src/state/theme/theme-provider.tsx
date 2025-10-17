import type React from "react";
import { useCallback, useMemo, useState } from "react";
import type { Theme } from "./theme-context";
import { ThemeContext } from "./theme-context";

export function ThemeProvider({
  initialTheme = "light",
  children,
}: {
  initialTheme?: Theme;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const toggle = useCallback(
    () => setTheme((t) => (t === "light" ? "dark" : "light")),
    []
  );
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
