import React from "react";
import { ConfigProvider } from "antd";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const primaryColor = "#054058";
  const info = "#f79b07";

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 2,
          colorPrimary: primaryColor,
        },

        components: {
          Button: {
            controlHeight: 45,
            controlOutline: "none",
            colorBorder: primaryColor,
          },
          Input: {
            controlHeight: 45,
            controlOutline: "none",
          },
          Select: {
            controlHeight: 45,
            controlOutline: "none",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export default ThemeProvider;
