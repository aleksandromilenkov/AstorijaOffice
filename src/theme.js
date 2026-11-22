import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#862e9c',
    },
    secondary: {
      main: '#ae3ec9',
    },
    // Promotions: discount badges and promo prices.
    sale: {
      main: '#e8365d',
      dark: '#c41f47',
      light: '#ffe3ea',
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
