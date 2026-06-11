import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#862e9c'
    },
    secondary: {
      main: '#ae3ec9'
    }
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h1: { fontSize: '2.6rem' },
    h2: { fontSize: '2rem' }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body, #root, #app-root': {
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