'use client'

import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import AdminNav from '@/components/admin/AdminNav'

export default function AdminPage() {
  return (
    <Box sx={{ maxWidth: 980, mx: 'auto', px: 3, py: 4 }}>
      <AdminNav active="/admin" />

      <Typography variant="h4" component="h1" sx={{ mb: 2, textAlign: 'center' }}>
        Администраторска табла
      </Typography>

        <Paper sx={{ p: 4, mb: 4 }}>
          {/* Container to layout description and action buttons side‑by‑side on medium+ screens */}
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              // Single column on xs, two columns (description | actions) on md and up
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
            }}
          >
            {/* Left column – description text */}
            <Box>
              <Typography sx={{ mb: 2 }}>
                Добредојдовте во админ панелот на Асторија. Овде можете да додавате нови категории
                и продукти во вашата продавница. Исто така и да прегледувате нарачки.
              </Typography>
              <Typography sx={{ mb: 3 }}>
                Главното мени во горниот дел на страницата останува видливо за да можете лесно да
                се вратите на Дома, Продавница, За нас и Контакт.
              </Typography>
            </Box>
            {/* Right column – action buttons stacked vertically */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                // Always stretch buttons so they share the same width regardless of label length
                alignItems: 'stretch',
              }}
            >
              <Button component={Link} href="/admin/categories" variant="contained" fullWidth>
                Управувај категории
              </Button>
              <Button component={Link} href="/admin/products" variant="contained" fullWidth>
                Управувај продукти
              </Button>
              <Button component={Link} href="/admin/orders" variant="contained" fullWidth>
                Управувај нарачки
              </Button>
            </Box>
          </Box>
        </Paper>
    </Box>
  )
}
