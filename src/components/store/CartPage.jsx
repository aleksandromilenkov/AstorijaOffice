'use client'

import Link from 'next/link'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CartBody from '@/components/store/CartBody'

/**
 * Full-page cart route. Lives at `/kosnicka` and is what the header
 * cart icon links to. Cart state is held in `CartContext`, which
 * hydrates from localStorage so refresh / new-tab / close-and-reopen
 * all restore the same items.
 */
export default function CartPage() {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 } }}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'baseline',
          justifyContent: 'space-between',
          mb: { xs: 3, md: 4 },
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{ fontWeight: 800, letterSpacing: '0.18em', color: 'primary.main' }}
          >
            Асторија
          </Typography>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.6rem' } }}
          >
            Кошничка
          </Typography>
        </Box>
        <Typography
          component={Link}
          href="/prodavnica"
          variant="body2"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          ← Продолжи со купување
        </Typography>
      </Stack>

      <CartBody />
    </Box>
  )
}