import { useAuth0 } from '@auth0/auth0-react'
import { useCallback, useEffect, useState } from 'react'

const NAMESPACE = 'https://social-insper.com/'

export function useApi() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [roles, setRoles] = useState([])
  const [email, setEmail] = useState('')
  const [pronto, setPronto] = useState(false)

  // Ao logar: abre o crachá e lê cargos e e-mail
  useEffect(() => {
    if (!isAuthenticated) return
    getAccessTokenSilently()
      .then((token) => {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setRoles(payload[`${NAMESPACE}roles`] || [])
        setEmail(payload[`${NAMESPACE}email`] || '')
      })
      .finally(() => setPronto(true))
  }, [isAuthenticated, getAccessTokenSilently])

  // Chama o back já com o crachá no header
  const apiFetch = useCallback(async (path, { method = 'GET', body } = {}) => {
    const token = await getAccessTokenSilently()
    const resp = await fetch(`/api${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    if (!resp.ok) throw new Error(`Erro ${resp.status}`)
    const texto = await resp.text()
    return texto ? JSON.parse(texto) : null
  }, [getAccessTokenSilently])

  const temRole = (role) => roles.includes(role)

  return { apiFetch, roles, email, temRole, isAdmin: temRole('ADMIN'), pronto }
}