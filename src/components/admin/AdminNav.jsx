'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import LogoutIcon from '@mui/icons-material/Logout'
import { createClient } from '@/lib/supabase/client'

const adminLinks = [
  { label: 'Категории', href: '/admin/categories' },
  { label: 'Продукти', href: '/admin/products' },
  { label: 'Нарачки', href: '/admin/orders' },
]

export default function AdminNav({ active }) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    await createClient().auth.signOut()
    router.replace('/admin/login')
    router.refresh()
  }

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
      <Button
        onClick={handleSignOut}
        disabled={signingOut}
        color="inherit"
        startIcon={<LogoutIcon />}
        sx={{ textTransform: 'none', ml: 'auto' }}
      >
        {signingOut ? 'Се одјавувам...' : 'Одјави се'}
      </Button>
    </Box>
  )
}
