import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

// 1. Agregamos las importaciones de Redux
import { Provider } from 'react-redux'
import { store } from './store/store.ts' // Asegúrate de que la ruta coincida con donde creaste el store

import App from './App.tsx'
import tema from './ui-temas/tema.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={tema}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)