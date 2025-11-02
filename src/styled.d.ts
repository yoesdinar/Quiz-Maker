import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryLight: string;
      primaryDark: string;
      secondary: string;
      secondaryDark: string;
      background: string;
      backgroundLight: string;
      surface: string;
      text: string;
      textSecondary: string;
      border: string;
      error: string;
      errorBg: string;
      errorDark: string;
      warning: string;
      success: string;
      successDark: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
    };
  }
}