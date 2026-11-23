import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    // Astorija brand red (logo, buttons, key highlights)
    primary: {
      main: '#d71f2b',
      dark: '#b3121d',
      light: '#ff5a5f',
      contrastText: '#ffffff',
    },
    // Charcoal (dark sections, secondary accents)
    secondary: {
      main: '#1d2024',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#1b1d21',
      secondary: '#5b5f66',
    },
    // Promotions: discount badges and promo prices.
    sale: {
      main: '#f26a1b',
      dark: '#c2500f',
      light: '#ffeddc',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h1: { fontSize: '2.6rem' },
    h2: { fontSize: '2rem' },
  },
  components: {
    // Tactile buttons: lift on hover, press in on click.
    MuiButton: {
      styleOverrides: {
        root: {
          transition:
            'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease',
          '&:active': { transform: 'scale(0.97)' },
        },
        contained: {
          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 24px -10px rgba(215,31,43,0.6)' },
          '&:active': { transform: 'translateY(0) scale(0.97)' },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease',
          '&:active': { transform: 'scale(0.9)' },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease',
          '&:hover': { transform: 'scale(1.06)' },
          '&:active': { transform: 'scale(0.94)' },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          overflowX: 'hidden',
          maxWidth: '100%',
        },
        '*': {
          boxSizing: 'border-box',
        },
      },
    },
  },
})

export default theme
