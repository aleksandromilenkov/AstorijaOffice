import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { formatPrice } from '@/lib/formatPrice'

const SIZES = {
  sm: { now: '1.05rem', was: '0.85rem' },
  md: { now: '1.35rem', was: '0.95rem' },
  lg: { now: '2.2rem', was: '1.15rem' },
}

/**
 * Price display. With a promo (`regularPrice` > `price`) the promo price is
 * shown in the sale colour next to the crossed-out regular price, plus an
 * optional "Заштедувате …" line. Without a promo it is a plain price.
 */
export default function PriceTag({
  price,
  regularPrice,
  size = 'md',
  showSavings = false,
  inverted = false,
  fromPrefix = false,
}) {
  const s = SIZES[size] ?? SIZES.md
  const onSale = regularPrice != null && regularPrice > price

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.25, flexWrap: 'wrap' }}>
        <Typography
          component="span"
          sx={{
            fontWeight: 800,
            fontSize: s.now,
            lineHeight: 1.1,
            color: onSale ? (inverted ? '#ffb37a' : 'sale.main') : inverted ? '#fff' : 'primary.main',
            letterSpacing: '-0.01em',
          }}
        >
          {fromPrefix ? (
            <Box component="span" sx={{ fontSize: '0.6em', fontWeight: 700, mr: 0.5 }}>
              од
            </Box>
          ) : null}
          {formatPrice(price)}
        </Typography>
        {onSale ? (
          <Typography
            component="del"
            aria-label={`Редовна цена ${formatPrice(regularPrice)}`}
            sx={{
              fontWeight: 600,
              fontSize: s.was,
              color: inverted ? 'rgba(255,255,255,0.6)' : 'text.disabled',
              textDecorationThickness: '2px',
            }}
          >
            {formatPrice(regularPrice)}
          </Typography>
        ) : null}
      </Box>
      {onSale && showSavings ? (
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            fontWeight: 700,
            color: inverted ? 'rgba(255,255,255,0.85)' : 'success.dark',
          }}
        >
          Заштедувате {formatPrice(regularPrice - price)}
        </Typography>
      ) : null}
    </Box>
  )
}
