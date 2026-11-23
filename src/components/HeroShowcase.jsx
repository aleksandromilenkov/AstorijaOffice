'use client'

import Image from 'next/image'
import Box from '@mui/material/Box'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

// Real printed work from the gallery (public/img/products).
const SHOTS = [
  { src: '/img/products/shirt1.jpg', rotate: -12, x: -118, y: 18 },
  { src: '/img/products/shirt3.jpg', rotate: -4, x: -40, y: -6 },
  { src: '/img/products/shirt6.jpg', rotate: 5, x: 38, y: 4 },
  { src: '/img/products/shirt2.jpg', rotate: 13, x: 116, y: 26 },
]

export const GALLERY_HREF = '/#products'

/**
 * "Our work" showcase in the hero's empty right side: real printed products
 * stacked like printed proofs. They float gently, fan out on hover and the
 * whole stack links to the gallery section.
 */
export default function HeroShowcase() {
  return (
    <Box
      component="a"
      href={GALLERY_HREF}
      aria-label="Погледни ги нашите отпечатени производи"
      sx={{
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-46%)',
        width: 420,
        height: 420,
        display: { xs: 'none', lg: 'block' },
        zIndex: 1,
        cursor: 'pointer',
        // fan out on hover
        '&:hover .shot': { transform: 'translate(var(--fx), var(--fy)) rotate(var(--fr))' },
        '&:hover .shot img': { transform: 'scale(1.04)' },
        '&:hover .label': { transform: 'translateY(-4px)', boxShadow: '0 16px 36px -12px rgba(0,0,0,0.6)' },
        '&:hover .label svg': { transform: 'translateX(4px)' },
        '&:focus-visible': { outline: '3px solid #ff5a5f', outlineOffset: 8, borderRadius: 4 },
      }}
    >
      {SHOTS.map((shot, i) => (
        // outer: entrance + gentle float; inner: resting pose / fanned pose
        <Box
          key={shot.src}
          className="a-scale-in"
          style={{ '--d': `${700 + i * 120}ms` }}
          sx={{ position: 'absolute', left: '50%', top: '42%', zIndex: i }}
        >
          <Box sx={{ animation: `a-float ${4.2 + i * 0.5}s ease-in-out ${i * 0.4}s infinite` }}>
            <Box
              className="shot"
              style={{
                '--rx': `${shot.x * 0.92}px`,
                '--ry': `${shot.y}px`,
                '--rr': `${shot.rotate * 0.85}deg`,
                '--fx': `${shot.x * 1.12}px`,
                '--fy': `${shot.y - 14}px`,
                '--fr': `${shot.rotate * 1.25}deg`,
              }}
              sx={{
                width: 190,
                height: 240,
                ml: '-95px',
                mt: '-120px',
                p: '7px',
                pb: '26px',
                bgcolor: '#fff',
                borderRadius: '10px',
                boxShadow: '0 24px 48px -18px rgba(0,0,0,0.65), 0 2px 6px rgba(0,0,0,0.25)',
                transform: 'translate(var(--rx), var(--ry)) rotate(var(--rr))',
                transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: '6px' }}>
                <Image
                  src={shot.src}
                  alt=""
                  fill
                  sizes="190px"
                  style={{ objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      ))}

      {/* Label: position wrapper → entrance animation → hover target */}
      <Box sx={{ position: 'absolute', left: '50%', bottom: 18, transform: 'translateX(-50%)', zIndex: 10 }}>
      <Box className="a-fade-up" style={{ '--d': '1250ms' }}>
      <Box
        className="label"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 2.25,
          py: 1.1,
          borderRadius: 999,
          bgcolor: '#fff',
          color: '#1b1d21',
          fontWeight: 800,
          fontSize: '0.92rem',
          whiteSpace: 'nowrap',
          boxShadow: '0 12px 30px -12px rgba(0,0,0,0.55)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease',
          '& svg': { color: '#d71f2b', transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' },
        }}
      >
        Наши отпечатени производи <ArrowForwardRoundedIcon fontSize="small" />
      </Box>
      </Box>
      </Box>
    </Box>
  )
}
