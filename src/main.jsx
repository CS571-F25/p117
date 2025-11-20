import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found!')
  document.body.innerHTML = '<div style="padding: 20px; font-family: Arial;">Error: Root element not found. Please check the HTML.</div>'
} else {
  try {
    createRoot(rootElement).render(<App />)
  } catch (error) {
    console.error('Error rendering app:', error)
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial;">
        <h2>Error Loading Application</h2>
        <p>${error.message}</p>
        <button onclick="window.location.reload()">Reload Page</button>
      </div>
    `
  }
}
