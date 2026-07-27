'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import InputBase from '@mui/material/InputBase'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useCart } from '@/store/CartContext'

/**
 * Amazon-style header search bar + cart link.
 *
 * Submitting the search pushes `/prodavnica?q=...` so the route's
 * server page can read it from `searchParams` and pass it down to the
 * grid. The cart icon is a real link to `/kosnicka`, where the full
 * cart page is rendered — no more slide-in drawer.
 */
export default function HeaderSearch() {
  const router = useRouter()
  const { count } = useCart()
  const [q, setQ] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    const next = q.trim()
    router.push(next ? `/prodavnica?q=${encodeURIComponent(next)}` : '/prodavnica')
  }

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        flex: 1,
        mx: 3,
        alignItems: 'center',
        maxWidth: 560,
      }}
    >
      <Box
        component="form"
        onSubmit={onSubmit}
        role="search"
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 999,
          px: 2,
          py: 0.25,
          boxShadow: '0 2px 8px rgba(15,15,15,0.05)',
          transition: 'box-shadow 160ms ease, border-color 160ms ease',
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: '0 0 0 4px rgba(134,46,156,0.12)',
          },
        }}
      >
        <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
        <InputBase
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Пребарај производи..."
          inputProps={{ 'aria-label': 'Пребарај производи' }}
          sx={{ flex: 1, fontSize: '0.95rem' }}
        />
        <IconButton
          type="submit"
          aria-label="Пребарај"
          size="small"
          sx={{ ml: 0.5 }}
        >
          <SearchIcon fontSize="small" />
        </IconButton>
      </Box>

      <Tooltip title="Кошничка">
        <IconButton
          component={Link}
          href="/kosnicka"
          aria-label="Отвори кошничка"
          sx={{ ml: 1 }}
          color="primary"
        >
          <Badge
            badgeContent={count}
            color="secondary"
            overlap="circular"
            max={99}
          >
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Tooltip>
    </Box>
  )
}