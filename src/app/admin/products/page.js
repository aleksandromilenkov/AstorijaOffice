'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
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

export default function AdminProductsPage() {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [inStock, setInStock] = useState(true)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [filterCategoryId, setFilterCategoryId] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories()
    loadProducts()
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
    if (data?.length && !categoryId) {
      setCategoryId(data[0].id)
    }
  }

  async function loadProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('id,title,slug,description,image_url,price,category_id,in_stock,created_at')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
      return
    }
    setProducts(data ?? [])
  }

  const filteredProducts = products.filter((product) => {
    const normalizedTerm = search.trim().toLowerCase()
    if (!normalizedTerm && !filterCategoryId) {
      return true
    }

    const matchesCategory = filterCategoryId
      ? product.category_id === filterCategoryId
      : true

    if (!normalizedTerm) {
      return matchesCategory
    }

    const candidate = [
      product.title,
      product.slug,
      product.description,
      categories.find((category) => category.id === product.category_id)?.name,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return matchesCategory && candidate.includes(normalizedTerm)
  })

  function handleTitleChange(event) {
    const nextTitle = event.target.value
    setTitle(nextTitle)
    setSlug(slugify(nextTitle))
  }

  function resetForm() {
    setEditingId(null)
    setTitle('')
    setSlug('')
    setDescription('')
    setPrice('')
    setImageUrl('')
    setInStock(true)
    setCategoryId(categories?.[0]?.id ?? '')
    setError('')
    setMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!title.trim() || !slug.trim() || !price.trim() || !categoryId) {
      setError('Пополнете ги сите задолжителни полиња.')
      return
    }

    const parsedPrice = Number(price)
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Внесете валидна цена во MKD.')
      return
    }

    setLoading(true)
    let result

    if (editingId) {
      result = await supabase
        .from('products')
        .update({
          title,
          slug,
          description,
          category_id: categoryId,
          price: parsedPrice,
          image_url: imageUrl,
          in_stock: inStock,
        })
        .eq('id', editingId)
    } else {
      result = await supabase.from('products').insert([
        {
          title,
          slug,
          description,
          category_id: categoryId,
          price: parsedPrice,
          image_url: imageUrl,
          in_stock: inStock,
        },
      ])
    }

    setLoading(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    resetForm()
    setMessage(editingId ? 'Продуктот е успешно ажуриран.' : 'Продуктот е успешно додаден.')
    loadProducts()
  }

  function handleEdit(product) {
    setEditingId(product.id)
    setTitle(product.title)
    setSlug(product.slug)
    setDescription(product.description ?? '')
    setPrice(String(product.price ?? ''))
    setImageUrl(product.image_url ?? '')
    setCategoryId(product.category_id ?? '')
    setInStock(product.in_stock ?? true)
    setMessage('')
    setError('')
  }

  async function handleDelete(product) {
    if (!window.confirm(`Дали навистина сакате да го избришете продуктот "${product.title}"?`)) {
      return
    }

    setLoading(true)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setMessage('Продуктот е успешно избришан.')
    if (editingId === product.id) {
      resetForm()
    }
    loadProducts()
  }

  return (
    <Box sx={{ maxWidth: 980, mx: 'auto', px: 3, py: 4 }}>
      <AdminNav active="/admin/products" />

      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        {editingId ? 'Уреди продукт' : 'Создај продукт'}
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Детали за продуктот
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField
            label="Наслов"
            value={title}
            onChange={handleTitleChange}
            required
          />

          <TextField
            label="Slug"
            value={slug}
            onChange={(event) => setSlug(slugify(event.target.value))}
            helperText="Испратете url-friendly slug за производот"
            required
          />

          <TextField
            label="Опис"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            multiline
            rows={4}
          />

          <TextField
            label="Цена (MKD)"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            required
          />

          <FormControl fullWidth>
            <InputLabel id="category-label">Категорија</InputLabel>
            <Select
              labelId="category-label"
              label="Категорија"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Url за слика"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            helperText="Пример: /img/products/vizitki.svg"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={inStock}
                onChange={(event) => setInStock(event.target.checked)}
              />
            }
            label="На залиха"
          />

          {error ? <Alert severity="error">{error}</Alert> : null}
          {message ? <Alert severity="success">{message}</Alert> : null}

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button type="submit" variant="contained" disabled={loading || categories.length === 0}>
              {loading ? 'Се зачува...' : editingId ? 'Ажурирај продукт' : 'Креирај продукт'}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Typography variant="h6">Постоечки продукти</Typography>
          <Button component={Link} href="/admin/categories" variant="outlined">
            Нова категорија
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gap: 2, mb: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 260px' } }}>
          <TextField
            label="Пребаруване на продукти"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Име, slug, опис или категорија"
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="filter-category-label">Филтрирај по категорија</InputLabel>
            <Select
              labelId="filter-category-label"
              label="Филтрирај по категорија"
              value={filterCategoryId}
              onChange={(event) => setFilterCategoryId(event.target.value)}
            >
              <MenuItem value="">Сите категории</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {filteredProducts.length === 0 ? (
          <Typography>Не се пронајдени продукти за одбраните критериуми.</Typography>
        ) : (
          <Stack spacing={1}>
            {filteredProducts.map((product) => {
              const category = categories.find((item) => item.id === product.category_id)
              return (
                <Paper
                  key={product.id}
                  sx={{ p: 2, display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{product.title}</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                      {category?.name || 'Без категорија'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography>{product.price} MKD</Typography>
                      <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                        {product.in_stock ? 'На залиха' : 'Нема на залиха'}
                      </Typography>
                    </Box>
                    <IconButton onClick={() => handleEdit(product)} aria-label="Уреди" size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product)} aria-label="Избриши" size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              )
            })}
          </Stack>
        )}
      </Paper>
    </Box>
  )
}
