'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputAdornment from '@mui/material/InputAdornment'
import Divider from '@mui/material/Divider'
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import CloseIcon from '@mui/icons-material/Close'
import { mockProducts } from '@/data/mockProducts'
import { categories, sortOptions } from '@/data/categories'
import ProductCard from './ProductCard'

/**
 * The interactive "Продавница" view.
 *
 * Reads `?q=` (search) and `?cat=` (category) from the URL via
 * `useSearchParams` — this is what lets the Header's search bar drive
 * the same filter state without prop drilling.
 *
 * Filtering is local and instant; the URL only updates on submit or
 * category click, so typing in the page-level search bar doesn't fight
 * with the router. Header submissions replace the URL and re-mount the
 * inputs via the `key` derived from the search params.
 */
export default function ProdavnicaClient({ initialQ = '', initialCat = 'all' }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL is the source of truth for the initial filter state. Subsequent
  // user edits live in local state so typing doesn't fight with the
  // router. The page-level key on this component is changed by the
  // server route when `?q=` / `?cat=` change, which remounts us with
  // fresh state — no effect needed.
  const [search, setSearch] = useState(initialQ)
  const [category, setCategory] = useState(initialCat)
  const [sort, setSort] = useState('newest')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = mockProducts
    if (category && category !== 'all') {
      list = list.filter((p) => p.category === category)
    }
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }
    const sorted = list.slice()
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    // 'newest' keeps the original order — no timestamp yet.
    return sorted
  }, [search, category, sort])

  const pushUrl = (nextQ, nextCat) => {
    const params = new URLSearchParams(searchParams.toString())
    if (nextQ) params.set('q', nextQ)
    else params.delete('q')
    if (nextCat && nextCat !== 'all') params.set('cat', nextCat)
    else params.delete('cat')
    const qs = params.toString()
    router.replace(qs ? `/prodavnica?${qs}` : '/prodavnica', { scroll: false })
  }

  const onSubmitSearch = (e) => {
    e.preventDefault()
    pushUrl(search, category)
  }

  const onPickCategory = (key) => {
    setCategory(key)
    pushUrl(search, key)
    setFiltersOpen(false)
  }

  const activeCat = categories.find((c) => c.key === category) || categories[0]

  const sidebar = (
    <Box>
      <Typography
        variant="overline"
        sx={{ fontWeight: 800, letterSpacing: '0.14em', color: 'text.secondary' }}
      >
        Категории
      </Typography>
      <Stack spacing={0.5} sx={{ mt: 1.5 }}>
        {categories.map((c) => {
          const selected = c.key === category
          return (
            <Button
              key={c.key}
              onClick={() => onPickCategory(c.key)}
              fullWidth
              disableRipple
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                fontWeight: selected ? 800 : 600,
                color: selected ? 'primary.main' : 'text.primary',
                bgcolor: selected ? 'rgba(134,46,156,0.08)' : 'transparent',
                px: 1.5,
                py: 1.25,
                borderRadius: 2,
                '&:hover': { bgcolor: 'rgba(134,46,156,0.06)' },
              }}
            >
              {c.label}
            </Button>
          )
        })}
      </Stack>
    </Box>
  )

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 } }}>
      {/* Page header */}
      <Stack spacing={1} sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: '0.18em', color: 'primary.main' }}>
          Асторија · Продавница
        </Typography>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.6rem' } }}>
          Продавница
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
          Изберете од нашите најпопуларни производи за печатење. Испорака низ цела Македонија преку Cargo Express.
        </Typography>
      </Stack>

      {/* Top bar: search + sort */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        sx={{ mb: 3, alignItems: { md: 'center' } }}
      >
        <Box
          component="form"
          onSubmit={onSubmitSearch}
          sx={{ flex: 1, display: 'flex' }}
          role="search"
        >
          <TextField
            key={`q-${initialQ}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пребарај производи..."
            fullWidth
            size="medium"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 2 },
            }}
          />
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<TuneIcon />}
            onClick={() => setFiltersOpen(true)}
            sx={{
              display: { xs: 'inline-flex', md: 'none' },
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            Категории
          </Button>

          <Select
            size="medium"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            sx={{
              minWidth: { xs: '100%', sm: 220 },
              borderRadius: 2,
              '& .MuiSelect-select': { py: 1.1 },
            }}
          >
            {sortOptions.map((o) => (
              <MenuItem key={o.key} value={o.key}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>

      {/* Body: sidebar (desktop) + grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '260px 1fr' },
          gap: { xs: 3, md: 4 },
        }}
      >
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>{sidebar}</Box>

        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {filtered.length === 0
              ? 'Нема резултати'
              : `Прикажани ${filtered.length} ${filtered.length === 1 ? 'производ' : 'производи'}${
                  activeCat && activeCat.key !== 'all' ? ` во „${activeCat.label}“` : ''
                }`}
          </Typography>

          {filtered.length === 0 ? (
            <Box
              sx={{
                py: 8,
                textAlign: 'center',
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Нема производи за овој филтер
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Пробајте поинаква категорија или пребарување.
              </Typography>
              <Button
                variant="contained"
                onClick={() => onPickCategory('all')}
                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
              >
                Прикажи сè
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gap: { xs: 2, md: 3 },
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                },
              }}
            >
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Mobile off-canvas filter drawer */}
      <Drawer
        anchor="left"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        slotProps={{ paper: { sx: { width: 280, p: 2.5 } } }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Категории
          </Typography>
          <IconButton onClick={() => setFiltersOpen(false)} aria-label="Затвори">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider sx={{ mb: 1.5 }} />
        {sidebar}
      </Drawer>
    </Box>
  )
}