import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#CF13B3',
      light: '#E6196B',
      dark: '#8D0BD1',
    },
    text: {
      primary: '#F5F5F7',
      secondary: '#A6A6A8',
    },
    background: {
      default: '#070614',
      paper: '#121212',
    },
  },
  typography: {
    fontFamily: 'var(--font-montserrat)',
    body1: {
      lineHeight: 1.5,
    },
    body2: {
      lineHeight: 1.5,
    },
    h1: {
      fontSize: '2.618rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h2: {
      fontSize: '1.618rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h3: {
      fontSize: '1.2rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          '-ms-overflow-style': 'none',
        },
        '.simplebar-scrollbar::before': {
          backgroundColor: '#F5F5F7 !important',
          opacity: '0.2 !important',
          width: '4px !important',
          borderRadius: '4px !important',
        },
        '.simplebar-track': {
          backgroundColor: 'transparent !important',
          width: '6px !important',
          right: '4px !important',
        },
        '.simplebar-track.simplebar-vertical': {
          top: '4px !important',
          bottom: '4px !important',
        },
        '.simplebar-scrollbar:hover::before': {
          opacity: '0.4 !important',
        }
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 24,
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#070614',
          borderRight: '1px solid rgba(255,255,255,0.1)',
        }
      }
    },
  }
}); 