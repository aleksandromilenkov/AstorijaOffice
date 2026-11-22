'use client'

import Link from 'next/link'
import Button from '@mui/material/Button'

/**
 * MUI Button that navigates with Next.js <Link>. Server Components cannot
 * pass `component={Link}` to a client component themselves, so they use this.
 */
export default function LinkButton(props) {
  return <Button component={Link} {...props} />
}
