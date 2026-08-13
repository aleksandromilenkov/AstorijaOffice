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

      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Администраторска табла
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography sx={{ mb: 2 }}>
          Добредојдовте во админ панелот на Асторија. Овде можете да додавате нови категории
          и продукти во вашата продавница.
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Главното мени во горниот дел на страницата останува видливо за да можете лесно да
          се вратите на Дома, Продавница, За нас и Контакт.
        </Typography>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <Button component={Link} href="/admin/categories" variant="contained">
            Управувај категории
          </Button>
          <Button component={Link} href="/admin/products" variant="contained">
            Управувај продукти
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
