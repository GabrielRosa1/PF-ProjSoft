import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import { useApi } from './useApi'

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0()

  if (isLoading) return <p>Carregando...</p>

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Prova Final</h1>
        <button onClick={() => loginWithRedirect()}>Entrar</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Logado como <b>{user?.email}</b></span>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Sair
        </button>
      </div>

      <TesteAmbiente />
    </div>
  )
}

function TesteAmbiente() {
  const { apiFetch, roles, email } = useApi()
  const [resp, setResp] = useState(null)
  const [erro, setErro] = useState('')

  const testar = async () => {
    try {
      setErro('')
      setResp(await apiFetch('/me'))
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <div>
      <h2>Teste do ambiente</h2>
      <p>E-mail no token: <b>{email || '(vazio)'}</b></p>
      <p>Roles no token: <b>{roles.join(', ') || '(nenhuma)'}</b></p>
      <button onClick={testar}>Chamar GET /me no back</button>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {resp && <pre>{JSON.stringify(resp, null, 2)}</pre>}
    </div>
  )
}

export default App