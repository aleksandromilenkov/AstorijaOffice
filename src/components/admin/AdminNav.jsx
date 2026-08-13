'use client'

import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const adminLinks = [
  { label: 'Категории', href: '/admin/categories' },
  { label: 'Продукти', href: '/admin/products' },
]

export default function AdminNav({ active }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        alignItems: 'center',
        mb: 4,
      }}
    >
      <Typography sx={{ fontWeight: 700, minWidth: 120 }}>Админ панел:</Typography>
      {adminLinks.map((item) => (
        <Button
          key={item.href}
          component={Link}
          href={item.href}
          variant={active === item.href ? 'contained' : 'outlined'}
          color={active === item.href ? 'primary' : 'inherit'}
          sx={{ textTransform: 'none' }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  )
}
