'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setError(error.message)
    router.push('/admin')
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3, py: 6 }}>
      <Paper sx={{ width: '100%', maxWidth: 520, p: 4, boxShadow: 6, borderRadius: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
          Админ влез
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Внесете го вашиот администраторски email и лозинка за да управувате со продукти и категории.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField
            label="Е-пошта"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Лозинка"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? 'Се најавувам...' : 'Најави се'}
          </Button>

          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            Ако не сте администратор, користете го главниот сајт без /admin во URL-то.
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}