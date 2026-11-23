'use client'

import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'

export const MAX_PHOTOS = 8

let keySeq = 0
const nextKey = () => `photo-${Date.now()}-${keySeq++}`

/** Saved URLs → editor items. */
export function photosFromUrls(urls = []) {
  return urls.filter(Boolean).map((url) => ({ key: nextKey(), url }))
}

/**
 * Photo manager for a product: add several photos, reorder, choose the main
 * one (first), remove. New files are kept as local previews; the form
 * uploads them on save. `photos` items: { key, url? , file?, preview? }.
 */
export default function ProductPhotosEditor({ photos, onChange, disabled = false }) {
  const inputRef = useRef(null)

  // Free object URLs of local previews when they leave the list / on unmount.
  const previews = useRef(new Set())
  useEffect(() => {
    const current = new Set(photos.map((p) => p.preview).filter(Boolean))
    for (const url of previews.current) {
      if (!current.has(url)) URL.revokeObjectURL(url)
    }
    previews.current = current
  }, [photos])
  useEffect(() => () => previews.current.forEach((url) => URL.revokeObjectURL(url)), [])

  function addFiles(fileList) {
    const room = MAX_PHOTOS - photos.length
    const files = Array.from(fileList ?? []).filter((f) => f.type.startsWith('image/')).slice(0, room)
    if (files.length === 0) return
    onChange([
      ...photos,
      ...files.map((file) => ({ key: nextKey(), file, preview: URL.createObjectURL(file) })),
    ])
  }

  function move(index, delta) {
    const target = index + delta
    if (target < 0 || target >= photos.length) return
    const next = photos.slice()
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  function makeMain(index) {
    if (index === 0) return
    const next = photos.slice()
    const [item] = next.splice(index, 1)
    onChange([item, ...next])
  }

  const full = photos.length >= MAX_PHOTOS

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ fontWeight: 700 }}>Фотографии</Typography>
        <Typography variant="body2" color="text.secondary">
          {photos.length} / {MAX_PHOTOS} · првата е главна
        </Typography>
      </Box>

      <Box
        onDragOver={(e) => {
          if (!disabled && !full) e.preventDefault()
        }}
        onDrop={(e) => {
          e.preventDefault()
          if (!disabled) addFiles(e.dataTransfer.files)
        }}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 1.5,
          p: 1.5,
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      >
        {photos.map((photo, index) => (
          <Box
            key={photo.key}
            sx={{
              position: 'relative',
              aspectRatio: '1 / 1',
              borderRadius: 1.5,
              overflow: 'hidden',
              bgcolor: '#fff',
              border: '2px solid',
              borderColor: index === 0 ? 'primary.main' : 'divider',
              '&:hover .photo-actions': { opacity: 1 },
            }}
          >
            <Box
              component="img"
              src={photo.preview || photo.url}
              alt={`Фотографија ${index + 1}`}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {index === 0 ? (
              <Box
                sx={{
                  position: 'absolute',
                  top: 6,
                  left: 6,
                  px: 0.75,
                  borderRadius: 1,
                  bgcolor: 'primary.main',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                }}
              >
                Главна
              </Box>
            ) : null}
            {photo.file ? (
              <Box
                sx={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  px: 0.75,
                  borderRadius: 1,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                }}
              >
                Нова
              </Box>
            ) : null}
            <Box
              className="photo-actions"
              sx={{
                position: 'absolute',
                insetInline: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'space-between',
                bgcolor: 'rgba(20,22,26,0.72)',
                opacity: { xs: 1, md: 0 },
                transition: 'opacity 0.2s ease',
                '& .MuiIconButton-root': { color: '#fff', p: 0.5 },
              }}
            >
              <Tooltip title="Помести лево">
                <span>
                  <IconButton size="small" disabled={disabled || index === 0} onClick={() => move(index, -1)} aria-label="Помести лево">
                    <ChevronLeftIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={index === 0 ? 'Главна фотографија' : 'Направи главна'}>
                <span>
                  <IconButton size="small" disabled={disabled || index === 0} onClick={() => makeMain(index)} aria-label="Направи главна">
                    {index === 0 ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Отстрани">
                <span>
                  <IconButton
                    size="small"
                    disabled={disabled}
                    onClick={() => onChange(photos.filter((_, i) => i !== index))}
                    aria-label="Отстрани фотографија"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Помести десно">
                <span>
                  <IconButton
                    size="small"
                    disabled={disabled || index === photos.length - 1}
                    onClick={() => move(index, 1)}
                    aria-label="Помести десно"
                  >
                    <ChevronRightIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
        ))}

        {!full ? (
          <Button
            variant="outlined"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            sx={{
              aspectRatio: '1 / 1',
              flexDirection: 'column',
              gap: 0.5,
              textTransform: 'none',
              fontWeight: 700,
              borderStyle: 'dashed',
              borderRadius: 1.5,
            }}
          >
            <AddPhotoAlternateOutlinedIcon />
            Додади
          </Button>
        ) : null}
      </Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          addFiles(e.target.files)
          e.target.value = ''
        }}
      />
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
        Изберете повеќе фотографии одеднаш или повлечете ги тука. Новите се прикачуваат при зачувување.
      </Typography>
    </Box>
  )
}
