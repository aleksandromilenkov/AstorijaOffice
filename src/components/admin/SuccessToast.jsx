'use client'

import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

/**
 * Success notification for admin forms: slides in at the bottom, closes by
 * itself after a few seconds (or with ✕). Errors stay inline on purpose —
 * those must be read and fixed.
 */
export default function SuccessToast({ message, onClose, duration = 3500 }) {
  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={duration}
      onClose={(_, reason) => {
        if (reason !== 'clickaway') onClose()
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity="success"
        variant="filled"
        onClose={onClose}
        sx={{ fontWeight: 600, boxShadow: '0 12px 30px -10px rgba(0,0,0,0.35)' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
