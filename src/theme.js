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
