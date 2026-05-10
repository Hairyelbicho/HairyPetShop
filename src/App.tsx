
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router'
import HairyBot from './components/chat/HairyBot'

function App() {
  return (
    <BrowserRouter basename={__BASE_PATH__}>
      <AppRoutes />
      <HairyBot />
    </BrowserRouter>
  )
}

export default App
