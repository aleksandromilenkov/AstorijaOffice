'use client'

import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

/**
 * Cart icon that bounces when something lands in the cart (`cart:bump`,
 * fired by flyToCart). Also marks itself as the fly-to-cart target.
 */
export default function CartIcon(props) {
  const [bumps, setBumps] = useState(0)

  useEffect(() => {
    const onBump = () => setBumps((n) => n + 1)
    window.addEventListener('cart:bump', onBump)
    return () => window.removeEventListener('cart:bump', onBump)
  }, [])

  return (
    <Box
      component="span"
      data-cart-target
      key={bumps}
      sx={{
        display: 'inline-flex',
        animation: bumps ? 'a-bump 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
      }}
    >
      <ShoppingCartIcon {...props} />
    </Box>
  )
}
