import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Gallery from './Gallery'

const SHIRTS = Array.from({ length: 12 }, (_, i) => `/img/products/shirt${i + 1}.jpg`)

export default function Products() {
  const [galleryStart, setGalleryStart] = useState(null)

  return (
    <>
      <Box component="section" id="products" sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" sx={{ mb: 1, fontWeight: 700 }}>
            Our Printed Products
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mb: 5, fontSize: '0.95rem' }}>
            Click any design to explore in full screen
          </Typography>

          {/* Thumbnail grid */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(3, 1fr)',
              sm: 'repeat(4, 1fr)',
              md: 'repeat(6, 1fr)',
            },
            gap: { xs: 1, sm: 1.5 },
          }}>
            {SHIRTS.map((src, i) => (
              <motion.div
                key={i}
                onClick={() => setGalleryStart(i)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                whileHover={{ scale: 1.03 }}
                style={{ cursor: 'pointer' }}
              >
                <Box
                  sx={{
                    aspectRatio: '1 / 1',
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    bgcolor: '#f5f5f5',
                    position: 'relative',
                  }}
                >
                  <Box
                    component="img"
                    src={src}
                    alt={`T-shirt design ${i + 1}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.35s ease',
                    }}
                  />
                  <Box className="overlay" sx={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(134,46,156,0.3)',
                    opacity: 0,
                    transition: 'opacity 0.25s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Box sx={{
                      width: 36, height: 36, borderRadius: '50%',
                      border: '1.5px solid #fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M8 3l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {galleryStart !== null && (
        <Gallery
          initialIndex={galleryStart}
          onClose={() => setGalleryStart(null)}
        />
      )}
    </>
  )
}