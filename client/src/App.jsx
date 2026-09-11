import { useState } from 'react'
import './App.css'

const initialResponse = {
  status: 'Sin ejecutar',
  body: 'Elegir una accion para llamar al backend por medio del proxy.',
}

function App() {
  const [response, setResponse] = useState(initialResponse)
  const [loading, setLoading] = useState(false)

  async function callProxy(path) {
    setLoading(true)

    try {
      const apiResponse = await fetch(path)
      const data = await apiResponse.json()

      setResponse({
        status: `${apiResponse.status} ${apiResponse.statusText}`,
        body: JSON.stringify(data, null, 2),
      })
    } catch (error) {
      setResponse({
        status: 'Error de conexion',
        body:
          'No se pudo contactar al proxy. Revisar que el servidor este corriendo con npm run dev dentro de server.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">React + Express + SQL Server</p>
        <h1>Demo de proxy para la exposicion</h1>
        <p className="summary">
          El navegador llama a <code>/api</code>, Vite lo manda al backend y el
          backend queda preparado para consultar SQL Server con <code>mssql</code>.
        </p>
      </section>

      <section className="flow" aria-label="Flujo de la aplicacion">
        <div>
          <span>1</span>
          <strong>Cliente React</strong>
          <p>Hace fetch a una ruta interna.</p>
        </div>
        <div>
          <span>2</span>
          <strong>Proxy backend</strong>
          <p>Express recibe la llamada en /api.</p>
        </div>
        <div>
          <span>3</span>
          <strong>SQL Server</strong>
          <p>La consulta queda aislada del navegador.</p>
        </div>
      </section>

      <section className="tester">
        <div className="actions">
          <button type="button" onClick={() => callProxy('/api/health')}>
            Probar proxy
          </button>
          <button type="button" onClick={() => callProxy('/api/alumnos')}>
            Probar SQL Server
          </button>
        </div>

        <div className="response">
          <div className="response-header">
            <span>Respuesta</span>
            <strong>{loading ? 'Cargando...' : response.status}</strong>
          </div>
          <pre>{response.body}</pre>
        </div>
      </section>
    </main>
  )
}

export default App
