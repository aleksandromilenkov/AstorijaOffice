'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import AdminNav from '@/components/admin/AdminNav'
import { formatPrice } from '@/lib/formatPrice'
import { createClient } from '@/lib/supabase/client'

const STATUS_COLORS = {
  pending: 'warning',
  shipped: 'success',
  cancelled: 'default',
}

const STATUS_LABELS = {
  pending: 'чекање',
  shipped: 'испорачано',
  cancelled: 'отказано',
}

export default function AdminOrdersPage() {
  const supabase = createClient()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    let cancelled = false

    async function loadOrders() {
      setLoading(true)
      setError('')

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(
          'id,created_at,status,shipping_name,shipping_phone,shipping_city,total_amount,notes',
        )
        .order('created_at', { ascending: false })
        .limit(200)

      if (cancelled) return

      if (fetchError) {
        setError(fetchError.message)
        setOrders([])
      } else {
        setOrders(data ?? [])
      }
      setLoading(false)
    }

    loadOrders()
    return () => {
      cancelled = true
    }
  }, [supabase])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return orders.filter((order) => {
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false
      }
      if (!term) return true
      const lineItems = parseLineItems(order.notes)
      const haystack = [
        order.id,
        order.shipping_name,
        order.shipping_phone,
        order.shipping_city,
        order.shipping_address,
        ...lineItems.map((it) => it.product_name),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [orders, search, statusFilter])

  const uniqueStatuses = useMemo(() => {
    const set = new Set(orders.map((o) => o.status).filter(Boolean))
    return Array.from(set)
  }, [orders])

  return (
    <Box sx={{ maxWidth: 1180, mx: 'auto', px: 3, py: 4 }}>
      <AdminNav active="/admin/orders" />

      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Нарачки
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ alignItems: { md: 'center' } }}
        >
          <TextField
            label="Пребарување"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Име, телефон, град или производ"
            fullWidth
          />
          <TextField
            select
            label="Статус"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            sx={{ minWidth: { md: 200 } }}
            slotProps={{ select: { native: true } }}
          >
            <option value="all">Сите</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status] ?? status}
              </option>
            ))}
          </TextField>
        </Stack>
      </Paper>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          Не може да се вчитаат нарачките: {error}
        </Alert>
      ) : null}

      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Број</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Дата</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Клиент</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Град</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Вкупно
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Статус</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Акции
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>Се вчитува...</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  Нема нарачки за одбраните критериуми.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => {
                const itemCount = parseLineItems(order.notes).reduce(
                  (sum, it) => sum + (Number(it.quantity) || 0),
                  0,
                )
                return (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace' }}>
                      {order.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleString('mk-MK', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>
                        {order.shipping_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.shipping_phone}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.shipping_city}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {formatPrice(order.total_amount)}
                      {itemCount > 0 ? (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          {itemCount} {itemCount === 1 ? 'производ' : 'производи'}
                        </Typography>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={STATUS_LABELS[order.status] ?? order.status}
                        color={STATUS_COLORS[order.status] ?? 'default'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        component={Link}
                        href={`/admin/orders/${order.id}`}
                        size="small"
                        variant="outlined"
                      >
                        Отвори
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

function parseLineItems(notes) {
  if (!notes) return []
  try {
    const parsed = JSON.parse(notes)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}