import { useAuth0 } from '@auth0/auth0-react'
import { useCallback, useEffect, useState } from 'react'
import { useApi } from './useApi'

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0()

  if (isLoading) return <p>Carregando...</p>

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Base de Conhecimento</h1>
        <button onClick={() => loginWithRedirect()}>Entrar</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Logado como <b>{user?.email}</b></span>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Sair
        </button>
      </div>

      <Artigos />
    </div>
  )
}

function mensagemErro(e) {
  if (e.message.includes('401')) return 'Sessão inválida. Saia e entre novamente.'
  if (e.message.includes('403')) return 'Você não tem permissão para essa ação.'
  if (e.message.includes('404')) return 'Artigo não encontrado.'
  if (e.message.includes('400')) return 'Dados inválidos. Confira os campos.'
  return e.message
}

function Artigos() {
  const { apiFetch, isAdmin, pronto } = useApi()
  const [artigos, setArtigos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    try {
      setErro('')
      setArtigos((await apiFetch('/artigos')) || [])
    } catch (e) {
      setErro(mensagemErro(e))
    } finally {
      setCarregando(false)
    }
  }, [apiFetch])

  useEffect(() => {
    carregar()
  }, [carregar])

  const deletar = async (id) => {
    if (!window.confirm('Deletar este artigo?')) return
    try {
      setErro('')
      await apiFetch(`/artigos/${id}`, { method: 'DELETE' })
      setArtigos((lista) => lista.filter((a) => a.id !== id))
    } catch (e) {
      setErro(mensagemErro(e))
    }
  }

  const aoCriar = (novo) => setArtigos((lista) => [...lista, novo])

  return (
    <div>
      {pronto && isAdmin && <FormArtigo onCriado={aoCriar} />}

      <h2>Artigos</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {carregando ? (
        <p>Carregando artigos...</p>
      ) : artigos.length === 0 ? (
        <p>Nenhum artigo cadastrado.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Título</th>
              <th style={th}>Descrição</th>
              <th style={th}>Prioridade</th>
              <th style={th}>Criado por</th>
              {isAdmin && <th style={th}></th>}
            </tr>
          </thead>
          <tbody>
            {artigos.map((a) => (
              <tr key={a.id}>
                <td style={td}>{a.titulo}</td>
                <td style={td}>{a.descricao}</td>
                <td style={td}>{a.prioridade}</td>
                <td style={td}>{a.emailCriador}</td>
                {isAdmin && (
                  <td style={td}>
                    <button onClick={() => deletar(a.id)}>Deletar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function FormArtigo({ onCriado }) {
  const { apiFetch } = useApi()
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [prioridade, setPrioridade] = useState(5)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  const enviar = async (ev) => {
    ev.preventDefault()
    if (!titulo.trim()) {
      setErro('Título é obrigatório.')
      return
    }
    try {
      setEnviando(true)
      setErro('')
      const novo = await apiFetch('/artigos', {
        method: 'POST',
        body: { titulo, descricao, prioridade: Number(prioridade) },
      })
      onCriado(novo)
      setTitulo('')
      setDescricao('')
      setPrioridade(5)
    } catch (e) {
      setErro(mensagemErro(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} style={{ margin: '24px 0', display: 'grid', gap: 8 }}>
      <h2>Novo artigo</h2>
      <input
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <textarea
        placeholder="Descrição"
        maxLength={1000}
        rows={4}
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <label>
        Prioridade (0 a 10):{' '}
        <input
          type="number"
          min={0}
          max={10}
          value={prioridade}
          onChange={(e) => setPrioridade(e.target.value)}
        />
      </label>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <button type="submit" disabled={enviando}>
        {enviando ? 'Salvando...' : 'Criar artigo'}
      </button>
    </form>
  )
}

const th = { textAlign: 'left', borderBottom: '2px solid #ccc', padding: 8 }
const td = { borderBottom: '1px solid #eee', padding: 8, verticalAlign: 'top' }

export default App