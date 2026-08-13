'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { createClient } from '@/lib/supabase/client'
import AdminNav from '@/components/admin/AdminNav'

function slugify(value = '') {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function AdminCategoriesPage() {
  const supabase = createClient()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [categories, setCategories] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
      return
    }
    setCategories(data ?? [])
  }

  function handleNameChange(event) {
    const nextName = event.target.value
    setName(nextName)
    setSlug(slugify(nextName))
  }

  function resetForm() {
    setName('')
    setSlug('')
    setEditingId(null)
    setError('')
    setMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!name.trim() || !slug.trim()) {
      setError('Пополнете име и slug пред да продолжите.')
      return
    }

    setLoading(true)
    let result

    if (editingId) {
      result = await supabase
        .from('categories')
        .update({ name, slug })
        .eq('id', editingId)
    } else {
      result = await supabase.from('categories').insert([{ name, slug }])
    }

    setLoading(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    resetForm()
    setMessage(editingId ? 'Категоријата е успешно ажурирана.' : 'Категоријата е успешно создадена.')
    loadCategories()
  }

  async function handleEdit(category) {
    setEditingId(category.id)
    setName(category.name)
    setSlug(category.slug)
    setMessage('')
    setError('')
  }

  async function handleDelete(category) {
    if (!window.confirm(`Дали навистина сакате да ја избришете категоријата "${category.name}"?`)) {
      return
    }

    setLoading(true)
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', category.id)
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setMessage('Категоријата е успешно избришана.')
    if (editingId === category.id) {
      resetForm()
    }
    loadCategories()
  }

  return (
    <Box sx={{ maxWidth: 980, mx: 'auto', px: 3, py: 4 }}>
      <AdminNav active="/admin/categories" />

      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Управување со категории
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {editingId ? 'Уреди категорија' : 'Креирај нова категорија'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField
            label="Име на категоријата"
            value={name}
            onChange={handleNameChange}
            required
          />

          <TextField
            label="Slug на категоријата"
            value={slug}
            onChange={(event) => setSlug(slugify(event.target.value))}
            helperText="Користете латинични букви, бројки и цртички"
            required
          />

          {error ? <Alert severity="error">{error}</Alert> : null}
          {message ? <Alert severity="success">{message}</Alert> : null}

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Се зачува...' : editingId ? 'Ажурирај категорија' : 'Креирај категорија'}
            </Button>
            {editingId ? (
              <Button type="button" variant="outlined" color="inherit" onClick={resetForm}>
                Откажи
              </Button>
            ) : null}
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Постоечки категории</Typography>
          <Button component={Link} href="/admin/products" variant="outlined">
            Нов продукт
          </Button>
        </Box>

        {categories.length === 0 ? (
          <Typography>Сè уште нема категории. Додадете ја првата категорија.</Typography>
        ) : (
          <Stack spacing={1}>
            {categories.map((category) => (
              <Paper
                key={category.id}
                sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{category.name}</Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                    {category.slug}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                    {new Date(category.created_at).toLocaleString('mk-MK')}
                  </Typography>
                  <IconButton onClick={() => handleEdit(category)} aria-label="Уреди" size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category)} aria-label="Избриши" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  )
}
