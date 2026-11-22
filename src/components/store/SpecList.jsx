import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

/**
 * Product specifications as a compact list ("100 листа", "Хартија 80 g/m2").
 * `dense` is the small version for product cards.
 */
export default function SpecList({ specs = [], dense = false }) {
  if (!specs.length) return null
  return (
    <Box
      component="ul"
      sx={{
        listStyle: 'none',
        m: 0,
        p: 0,
        display: 'grid',
        gap: dense ? 0.25 : 0.75,
      }}
    >
      {specs.map((spec) => (
        <Box
          component="li"
          key={spec}
          sx={{ display: 'flex', alignItems: 'baseline', gap: 1, minWidth: 0 }}
        >
          <Box
            aria-hidden
            sx={{
              flexShrink: 0,
              width: dense ? 5 : 6,
              height: dense ? 5 : 6,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              opacity: 0.6,
              transform: 'translateY(-2px)',
            }}
          />
          <Typography
            variant={dense ? 'body2' : 'body1'}
            color={dense ? 'text.secondary' : 'text.primary'}
            sx={{ lineHeight: 1.45 }}
            noWrap={dense}
          >
            {spec}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
