'use client'

import { useEffect, useState, useRef } from 'react'
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AddIcon from '@mui/icons-material/Add'
import { sortedVariants } from '@/lib/pricing'
import { createClient } from '@/lib/supabase/client'
import { uploadImageToCloudinary } from '@/lib/cloudinary'
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

// Ask the server to delete a replaced/removed image from Cloudinary.
// Failures are only logged: a leftover image is harmless.
async function deleteProductImage(url) {
  if (!url || !url.startsWith('https://res.cloudinary.com/')) return
  try {
    const resp = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: url }),
    })
    if (!resp.ok) console.warn('Cloudinary delete failed:', await resp.text())
  } catch (err) {
    console.warn('Cloudinary delete request failed:', err)
  }
}

// ISO timestamp → value for <input type="datetime-local"> in local time.
function toLocalInputValue(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function AdminProductsPage() {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [saleEndsAt, setSaleEndsAt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [inStock, setInStock] = useState(true)
  // One spec per line, e.g. "100 листа".
  const [specsText, setSpecsText] = useState('')
  // Quantity options: [{ id?, key, label, price }]
  const [variants, setVariants] = useState([])
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [filterCategoryId, setFilterCategoryId] = useState('')
  const [editingId, setEditingId] = useState(null)
  // Ref to the form container so we can scroll to it when editing a product
  const formRef = useRef(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  // Load initial data once – disable exhaustive‑deps lint for this effect
  useEffect(() => {
    loadCategories()
    loadProducts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

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
      .select('id,title,slug,description,image_url,price,sale_price,sale_ends_at,category_id,in_stock,created_at,specs,product_variants(id,label,price,sort_order)')
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

  // Update title without overwriting the slug. Users can now edit the slug
  // field manually; we keep the helper available for manual entry via the
  // slug text field's own onChange handler.
  function handleTitleChange(event) {
    const nextTitle = event.target.value
    setTitle(nextTitle)
    // Removed automatic slug generation to allow custom slugs (including dashes).
  }

  function resetForm() {
    setEditingId(null)
    setTitle('')
    setSlug('')
    setDescription('')
    setPrice('')
    setSalePrice('')
    setSaleEndsAt('')
    setImageUrl('')
    setImagePreview('')
    setImageFile(null)
    setUploadProgress('')
    setInStock(true)
    setSpecsText('')
    setVariants([])
    setCategoryId(categories?.[0]?.id ?? '')
    setError('')
    setMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

      // Normalise the slug only at submit time so the user can edit it freely.
      const normalizedSlug = slugify(slug)

      // Quantity options (optional). With options, the product price is the
      // lowest option price ("од ... ден.").
      const cleanVariants = variants
        .map((v) => ({ ...v, label: v.label.trim(), price: String(v.price).trim() }))
        .filter((v) => v.label || v.price)
      for (const v of cleanVariants) {
        const n = Number(v.price)
        if (!v.label || v.label.length > 60 || !Number.isInteger(n) || n < 0) {
          setError('Секоја опција за количина треба опис (пр. „100 парчиња“) и цена како цел број.')
          return
        }
      }
      const hasVariants = cleanVariants.length > 0
      const specs = specsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 12)
        .map((line) => line.slice(0, 80))

      if (!title.trim() || !normalizedSlug.trim() || (!hasVariants && !price.trim()) || !categoryId) {
      setError('Пополнете ги сите задолжителни полиња.')
      return
    }

    const parsedPrice = hasVariants
      ? Math.min(...cleanVariants.map((v) => Number(v.price)))
      : Number(price)
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Внесете валидна цена во MKD.')
      return
    }

    // Promotion (optional): promo price must be lower than the regular price.
    let parsedSalePrice = null
    if (String(salePrice).trim() !== '') {
      parsedSalePrice = Number(salePrice)
      if (!Number.isInteger(parsedSalePrice) || parsedSalePrice < 0 || parsedSalePrice >= parsedPrice) {
        setError('Промо цената мора да биде цел број помал од редовната цена.')
        return
      }
    }
    const parsedSaleEndsAt =
      parsedSalePrice != null && saleEndsAt ? new Date(saleEndsAt).toISOString() : null

    setLoading(true)
    let uploadedUrl = imageUrl

    if (imageFile) {
      try {
        setUploadingImage(true)
        setUploadProgress('Се прикачува слика на Cloudinary...')
        const uploadResult = await uploadImageToCloudinary(imageFile, { folder: 'astorija/products' })
        uploadedUrl = uploadResult.url
        setImageUrl(uploadedUrl)
        setUploadProgress('Сликата е успешно прикачена.')
      } catch (uploadError) {
        setLoading(false)
        setUploadingImage(false)
        setUploadProgress('')
        setError(uploadError.message ?? 'Прикачувањето на сликата не успеа.')
        return
      } finally {
        setUploadingImage(false)
      }
    }

    let result
    const previousImageUrl = editingId
      ? products.find((product) => product.id === editingId)?.image_url ?? null
      : null

    if (editingId) {
      result = await supabase
        .from('products')
          .update({
            title,
            slug: normalizedSlug,
          description,
          category_id: categoryId,
          price: parsedPrice,
          sale_price: parsedSalePrice,
          sale_ends_at: parsedSaleEndsAt,
          image_url: uploadedUrl,
          in_stock: inStock,
          specs,
        })
        .eq('id', editingId)
    } else {
      result = await supabase.from('products').insert([
        {
          title,
            slug: normalizedSlug,
          description,
          category_id: categoryId,
          price: parsedPrice,
          sale_price: parsedSalePrice,
          sale_ends_at: parsedSaleEndsAt,
          image_url: uploadedUrl,
          in_stock: inStock,
          specs,
        },
      ])
        .select('id')
        .single()
    }

    // Save quantity options: update kept ones, insert new, delete removed.
    if (!result.error) {
      const productId = editingId ?? result.data?.id
      const variantError = await saveVariants(productId, cleanVariants)
      if (variantError) result = { error: variantError }
    }

    setLoading(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    if (previousImageUrl && previousImageUrl !== uploadedUrl) {
      deleteProductImage(previousImageUrl)
    }

    resetForm()
    setMessage(editingId ? 'Продуктот е успешно ажуриран.' : 'Продуктот е успешно додаден.')
    loadProducts()
  }

  async function saveVariants(productId, rows) {
    if (!productId) return null
    const existing = products.find((p) => p.id === productId)?.product_variants ?? []
    const keepIds = rows.filter((r) => r.id).map((r) => r.id)
    const removed = existing.filter((v) => !keepIds.includes(v.id)).map((v) => v.id)

    if (removed.length) {
      const { error } = await supabase.from('product_variants').delete().in('id', removed)
      if (error) return error
    }
    for (const [index, row] of rows.entries()) {
      const values = { label: row.label, price: Number(row.price), sort_order: index }
      const { error } = row.id
        ? await supabase.from('product_variants').update(values).eq('id', row.id)
        : await supabase.from('product_variants').insert({ ...values, product_id: productId })
      if (error) return error
    }
    return null
  }

  function handleEdit(product) {
    setEditingId(product.id)
    setTitle(product.title)
    setSlug(product.slug)
    setDescription(product.description ?? '')
    setPrice(String(product.price ?? ''))
    setSalePrice(product.sale_price != null ? String(product.sale_price) : '')
    setSaleEndsAt(toLocalInputValue(product.sale_ends_at))
    setImageUrl(product.image_url ?? '')
    setImagePreview('')
    setImageFile(null)
    setUploadProgress('')
    setCategoryId(product.category_id ?? '')
    setInStock(product.in_stock ?? true)
    setSpecsText((product.specs ?? []).join('\n'))
    setVariants(
      sortedVariants(product).map((v) => ({ id: v.id, key: v.id, label: v.label, price: String(v.price) })),
    )
    setMessage('')
    setError('')
    // After state is set, scroll the form into view
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
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

    // Only remove the image once the product row is really gone.
    deleteProductImage(product.image_url)

    setMessage('Продуктот е успешно избришан.')
    if (editingId === product.id) {
      resetForm()
    }
    loadProducts()
  }

  return (
    <Box sx={{ maxWidth: 980, mx: 'auto', px: 3, py: 4 }}>
      <AdminNav active="/admin/products" />

      <Typography variant="h4" component="h1" sx={{ mb: 2 }} ref={formRef}>
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
            // Accept raw input so the user can type dashes freely. We will
            // normalise the slug on submit.
            onChange={(event) => setSlug(event.target.value)}
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
            label="Спецификации (по една во ред)"
            value={specsText}
            onChange={(event) => setSpecsText(event.target.value)}
            multiline
            minRows={3}
            placeholder={'100 листа\nХартија бездрвна 80 g/m2\nДимензија: 210 х 99 мм'}
            helperText="Се прикажуваат како точки на картичката и на страницата на производот (најмногу 12)."
          />

          <TextField
            label="Цена (MKD)"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            type="number"
            slotProps={{ htmlInput: { min: 0 } }}
            required={variants.length === 0}
            disabled={variants.length > 0}
            helperText={
              variants.length > 0
                ? 'Се пресметува автоматски: најниската цена од опциите за количина.'
                : undefined
            }
          />

          <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography sx={{ fontWeight: 700 }}>Опции за количина (опционално)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              На пр. „100 парчиња“ 190 ден., „500 парчиња“ 690 ден. Купувачот избира една опција.
              Промо цената важи како ист процент попуст за сите опции.
            </Typography>
            <Stack spacing={1.25}>
              {variants.map((variant, index) => (
                <Box
                  key={variant.key}
                  sx={{ display: 'grid', gap: 1, gridTemplateColumns: '1fr 140px auto', alignItems: 'center' }}
                >
                  <TextField
                    size="small"
                    label="Опис"
                    placeholder="100 парчиња"
                    value={variant.label}
                    onChange={(event) =>
                      setVariants((list) =>
                        list.map((v, i) => (i === index ? { ...v, label: event.target.value } : v)),
                      )
                    }
                  />
                  <TextField
                    size="small"
                    label="Цена (MKD)"
                    type="number"
                    slotProps={{ htmlInput: { min: 0 } }}
                    value={variant.price}
                    onChange={(event) =>
                      setVariants((list) =>
                        list.map((v, i) => (i === index ? { ...v, price: event.target.value } : v)),
                      )
                    }
                  />
                  <IconButton
                    aria-label="Отстрани опција"
                    onClick={() => setVariants((list) => list.filter((_, i) => i !== index))}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
            <Button
              startIcon={<AddIcon />}
              onClick={() =>
                setVariants((list) => [
                  ...list,
                  { key: `new-${Date.now()}-${list.length}`, label: '', price: '' },
                ])
              }
              sx={{ mt: 1, textTransform: 'none', fontWeight: 700 }}
            >
              Додади опција
            </Button>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(242,106,27,0.05)',
              border: '1px dashed rgba(242,106,27,0.35)',
            }}
          >
            <TextField
              label="Промо цена (MKD) — опционално"
              value={salePrice}
              onChange={(event) => setSalePrice(event.target.value)}
              type="number"
              slotProps={{ htmlInput: { min: 0 } }}
              helperText={
                salePrice && Number(price) > 0 && Number(salePrice) < Number(price)
                  ? `Попуст ${Math.round(((Number(price) - Number(salePrice)) / Number(price)) * 100)}%`
                  : 'Оставете празно ако нема промоција'
              }
            />
            <TextField
              label="Промоцијата трае до"
              value={saleEndsAt}
              onChange={(event) => setSaleEndsAt(event.target.value)}
              type="datetime-local"
              disabled={!String(salePrice).trim()}
              slotProps={{ inputLabel: { shrink: true } }}
              helperText="Празно = додека не ја отстраните"
            />
          </Box>

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

          <Box sx={{ display: 'grid', gap: 1 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              disabled={uploadingImage}
            >
              {imageFile ? `Избрана: ${imageFile.name}` : 'Прикачи слика на Cloudinary'}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (imagePreview) {
                    URL.revokeObjectURL(imagePreview)
                  }
                  setImageFile(file ?? null)
                  setImagePreview(file ? URL.createObjectURL(file) : '')
                  if (file) {
                    setUploadProgress('')
                  }
                }}
              />
            </Button>
            {(imagePreview || imageUrl) ? (
              <Box
                sx={{
                  mt: 1,
                  width: '100%',
                  maxWidth: 260,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  overflow: 'hidden',
                  backgroundColor: 'background.paper',
                }}
              >
                <Box
                  component="img"
                  src={imagePreview || imageUrl}
                  alt="Преглед на слика"
                  sx={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </Box>
            ) : null}
            {uploadProgress ? (
              <Typography variant="body2" color="text.secondary">
                {uploadProgress}
              </Typography>
            ) : null}
          </Box>

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
            <Button
              type="submit"
              variant="contained"
              disabled={loading || uploadingImage || categories.length === 0}
            >
              {uploadingImage
                ? 'Се прикачува слика...'
                : loading
                ? 'Се зачува...'
                : editingId
                ? 'Ажурирај продукт'
                : 'Креирај продукт'}
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
                      <Typography>
                        {product.sale_price != null ? (
                          <>
                            <Box component="span" sx={{ color: 'sale.main', fontWeight: 800 }}>
                              {product.sale_price} MKD
                            </Box>{' '}
                            <Box component="del" sx={{ color: 'text.disabled' }}>
                              {product.price}
                            </Box>
                          </>
                        ) : (
                          <>{product.price} MKD</>
                        )}
                      </Typography>
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
