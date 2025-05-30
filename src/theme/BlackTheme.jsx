import { createTheme } from '@mui/material';

export const BlackTheme = createTheme({
    palette: {
        primary: {
            main: 'rgba(24, 22, 22, 0.83)'
        },
        secondary: {
            main: '#494949'
        },
        error: {
            main: '#cc0404'
        },
        success: {
            main: '#4c8e00'
        },
        warning: {
            main: '#ffee00'
        },
        info: {
            main: '#9c9c9c'
        },
    }, 
    drawer: {
        width: 240,
    },
    fonts: {
        body: 'system-ui, sans-serif',
        heading: '"Avenir Next", sans-serif',
        monospace: 'Menlo, monospace',
      },
      colors: {
        text: '#000',
        background: '#757575',
        primary: '#000000',
      },
})