'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'

export const PRODUCT_PLACEHOLDER = '/img/placeholder-product.svg'

/**
 * <img> for product photos that falls back to a branded placeholder when
 * the product has no image or the URL is broken (e.g. a deleted file).
 * Accepts the same `sx` / extra props as an MUI Box rendered as <img>.
 */
export default function ProductImg({ src, alt = '', sx, ...rest }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const broken = !src || failedSrc === src

  return (
    <Box
      component="img"
      src={broken ? PRODUCT_PLACEHOLDER : src}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (src) setFailedSrc(src)
      }}
      sx={sx}
      {...rest}
    />
  )
}
