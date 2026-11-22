import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import MailOutlineIcon from '@mui/icons-material/EmailOutlined'
import { contact } from '@/content'

const phones = contact.info.filter((item) => item.icon === 'phone')
const email = contact.info.find((item) => item.icon === 'mail')
const invoiceMailHref = email
  ? `${email.href}?subject=${encodeURIComponent('Нарачка со плаќање по фактура')}`
  : null

/**
 * Payment methods shown at checkout.
 *  - Cash on delivery: the only method for online orders (always selected).
 *  - Invoice (фактура) for companies: shown as available, but only by direct
 *    contact — it cannot be chosen in the online order.
 */
export default function PaymentMethods() {
  return (
    <Box role="group" aria-labelledby="payment-methods-title">
      <Typography
        id="payment-methods-title"
        variant="subtitle2"
        sx={{ fontWeight: 800, mb: 1 }}
      >
        Начин на плаќање
      </Typography>

      <Stack spacing={1}>
        {/* Cash on delivery — selected */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'flex-start',
            p: 1.5,
            borderRadius: 2,
            border: '2px solid',
            borderColor: 'primary.main',
            bgcolor: 'rgba(134,46,156,0.05)',
          }}
        >
          <LocalShippingOutlinedIcon color="primary" sx={{ mt: 0.25 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, lineHeight: 1.3 }}>Плаќање при достава</Typography>
            <Typography variant="body2" color="text.secondary">
              Платете во готово кога ќе ја примите пратката.
            </Typography>
          </Box>
          <CheckCircleIcon color="primary" aria-label="Избрано" />
        </Box>

        {/* Invoice for companies — by direct contact only */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
            bgcolor: 'grey.50',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <ReceiptLongOutlinedIcon sx={{ mt: 0.25, color: 'text.secondary' }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                  Плаќање со фактура
                </Typography>
                <Chip label="За фирми" size="small" sx={{ fontWeight: 700, height: 22 }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Можно е за фирми, но не преку онлајн нарачка. Контактирајте нè директно и ќе ви
                подготвиме фактура:
              </Typography>
              <Stack spacing={0.5} sx={{ mt: 1 }}>
                {phones.map((phone) => (
                  <Link
                    key={phone.href}
                    href={phone.href}
                    underline="hover"
                    sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontWeight: 700, width: 'fit-content' }}
                  >
                    <PhoneOutlinedIcon sx={{ fontSize: 18 }} />
                    {phone.text}
                  </Link>
                ))}
                {invoiceMailHref ? (
                  <Link
                    href={invoiceMailHref}
                    underline="hover"
                    sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontWeight: 700, width: 'fit-content', wordBreak: 'break-all' }}
                  >
                    <MailOutlineIcon sx={{ fontSize: 18 }} />
                    {email.text}
                  </Link>
                ) : null}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
