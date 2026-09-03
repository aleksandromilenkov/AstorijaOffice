// src/components/store/ProductImageZoom.jsx
'use client'

import { useState, useRef, useCallback } from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import RefreshIcon from '@mui/icons-material/Refresh'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { styled } from '@mui/material/styles'

/**
 * ProductImageZoom - a component that displays a product image with:
 *   • Hover magnifier (inline zoom) that follows the cursor.
 *   • Full‑screen lightbox modal on click (or via a top‑corner button) with
 *     zoom in/out, reset and pan support.
 */
// Styled components that do not depend on component state must be defined
// outside the render function to avoid recreation on each render.
const ZoomContainer = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
})

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  userSelect: 'none',
  transition: 'transform 0.3s ease',
})

const ModalImage = styled('img')({
  maxWidth: '90vw',
  maxHeight: '90vh',
  userSelect: 'none',
})

export default function ProductImageZoom({ imageUrl, alt }) {
  // ---- Hover zoom state ----
  const [hovered, setHovered] = useState(false)
  const [origin, setOrigin] = useState({ x: '50%', y: '50%' })

  // ---- Lightbox modal state ----
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })
  const startOffset = useRef({ x: 0, y: 0 })

  // ---- Hover handlers ----
  const handleMouseEnter = () => setHovered(true)
  const handleMouseLeave = () => {
    setHovered(false)
    setOrigin({ x: '50%', y: '50%' })
  }
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setOrigin({ x: `${x}%`, y: `${y}%` })
  }

  // ---- Modal handlers ----
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  const zoomIn = () => setZoom((z) => Math.min(z + 0.5, 5))
  const zoomOut = () => setZoom((z) => Math.max(z - 0.5, 1))
  const resetZoom = () => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  // ---- Drag (pan) handlers for the modal ----
  const handleMouseDown = (e) => {
    if (zoom === 1) return // No panning needed when not zoomed
    dragging.current = true
    startPos.current = { x: e.clientX, y: e.clientY }
    startOffset.current = { ...offset }
    e.preventDefault()
  }
  const handleMouseUp = () => {
    dragging.current = false
  }
  const handleMouseMoveModal = (e) => {
    if (!dragging.current) return
    const dx = e.clientX - startPos.current.x
    const dy = e.clientY - startPos.current.y
    setOffset({
      x: startOffset.current.x + dx,
      y: startOffset.current.y + dy,
    })
  }

  // ---- Styled components ----
  // Definitions moved above the component to avoid recreating them on every render.

  return (
    <>
      {/* Inline hover zoom */}
      <ZoomContainer
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleOpen}
        sx={{ cursor: hovered ? 'zoom-in' : 'pointer' }}
      >
        {/* The visible image */}
        <StyledImage
          src={imageUrl}
          alt={alt}
          onError={(e) => (e.currentTarget.style.display = 'none')}
          sx={{
            transition: hovered ? 'none' : 'transform 0.3s ease',
            transform: hovered ? `scale(2)` : 'scale(1)',
            transformOrigin: `${origin.x} ${origin.y}`,
          }}
        />
        {/* Optional overlay button for explicit open */}
        <IconButton
          size="small"
          onClick={handleOpen}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255,255,255,0.7)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
          }}
          aria-label="Open image"
        >
          <SearchIcon fontSize="small" />
        </IconButton>
      </ZoomContainer>

      {/* Fullscreen modal */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        PaperProps={{ 
          sx: { 
            backgroundColor: 'rgba(0,0,0,0.9)',
            backgroundImage: 'none',
            boxShadow: 'none',
            border: 'none'
          } 
        }}
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'center',
            justifyContent: 'center',
          },
          '& .MuiPaper-root': {
            position: 'relative',
            maxWidth: 'max-content',
            maxHeight: 'max-content',
            overflow: 'visible',
            backgroundColor: 'transparent',
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'zoom-out',
          }}
          onClick={handleClose}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMoveModal}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalImage
              src={imageUrl}
              alt={alt}
              sx={{
                cursor: zoom > 1 ? 'grab' : 'default',
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transition: 'transform 0.2s ease-out',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
              }}
            />
          </Box>
          {/* Controls (Zoom & Reset) */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              gap: 1,
              color: '#fff',
              zIndex: 9999,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton onClick={zoomIn} color="inherit" aria-label="Zoom in" sx={{ backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}>
              <ZoomInIcon />
            </IconButton>
            <IconButton onClick={zoomOut} color="inherit" aria-label="Zoom out" sx={{ backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}>
              <ZoomOutIcon />
            </IconButton>
            <IconButton onClick={resetZoom} color="inherit" aria-label="Reset zoom" sx={{ backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}>
              <RefreshIcon />
            </IconButton>
          </Box>
          {/* Close button (top‑left) */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              color: '#fff',
              zIndex: 9999,
            }}
          >
            <IconButton onClick={handleClose} color="inherit" aria-label="Close" sx={{ backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </Dialog>
    </>
  )
}
