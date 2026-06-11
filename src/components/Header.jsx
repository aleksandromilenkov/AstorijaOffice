import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'

export default function Header({navOpen, setNavOpen, sticky = false}){
  const toggleNav = () => setNavOpen(!navOpen)
  const closeNav = () => setNavOpen(false)

  const navItems = [
    {label:'Products', href:'#products'},
    {label:'Services', href:'#services'},
    {label:'About', href:'#about'},
    {label:'Contact', href:'#contact', variant:'contained'}
  ]

  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          backgroundColor: sticky ? 'background.paper' : 'transparent',
          boxShadow: sticky ? 3 : 'none'
        }}
      >
        <Toolbar sx={{display:'flex', justifyContent:'space-between', minHeight: sticky ? 64 : 96}}>
          <Box component="a" href="#" sx={{display:'inline-flex', alignItems:'center'}}>
            <img src="/img/Screenshot_1.png" alt="Astorija logo" style={{height:56}} />
          </Box>

          <Box sx={{display:{xs:'none', md:'flex'}, gap:2}}>
            {navItems.map((item)=> (
              <Button key={item.label} href={item.href} variant={item.variant || 'text'} color="primary">
                {item.label}
              </Button>
            ))}
          </Box>

          <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleNav} sx={{display:{md:'none'}}}>
            {navOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={navOpen} onClose={closeNav}>
        <Box sx={{width:260}} role="presentation" onClick={closeNav}>
          <List>
            {navItems.map((item)=> (
              <ListItem key={item.label} disablePadding>
                <ListItemButton component="a" href={item.href}>
                  {item.label}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  )
}
