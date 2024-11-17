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
    fontSize: 14,
    h1: {
      fontFamily: 'var(--font-montserrat)',
      fontWeight: 600,
    },
    h2: {
      fontFamily: 'var(--font-montserrat)',
      fontWeight: 600,
    },
    h3: {
      fontFamily: 'var(--font-montserrat)',
      fontWeight: 500,
    },
    h4: {
      fontFamily: 'var(--font-montserrat)',
      fontWeight: 500,
    },
    h5: {
      fontFamily: 'var(--font-montserrat)',
      fontWeight: 500,
    },
    h6: {
      fontFamily: 'var(--font-montserrat)',
      fontWeight: 500,
    },
    body1: {
      fontFamily: 'var(--font-montserrat)',
      fontWeight: 400,
    },
    body2: {
      fontFamily: 'var(--font-montserrat)',
      fontWeight: 400,
    },
    button: {
      fontFamily: 'var(--font-montserrat)',
      fontWeight: 500,
    },
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: 'var(--font-montserrat)',
        },
        'pre, code': {
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        },
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
          borderRadius: 4,
          fontWeight: 500,
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