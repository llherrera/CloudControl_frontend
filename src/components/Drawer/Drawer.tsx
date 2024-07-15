import {
    Drawer,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useMediaQuery } from '@mui/material';

interface Props {
    page: number;
    callback: (page: number) => void;
}

export const DrawerMenu = ({page, callback}:Props) => {

    const handleButton = (page: number) => {
        callback(page);
    }

    return (
        <Drawer
            PaperProps={{
                sx: {
                    display: 'flex',
                    flexDirection: { xs: 'row', md: 'column' },
                    width: {xs: '100%', md:'160px'},
                    height: {md: '70%'},
                    position: 'absolute',
                    top: { xs: '230px', md: '250px', lg: '280px', xl: '140px' },
                    left: { xs: 0, xl: '192px' },
                    border: '',
                }
            }}
            variant="permanent"
            anchor={useMediaQuery('(min-width:768px)') ? 'left' : 'top'}
            >
            <Box role="presentation" sx={{ display: 'flex', width: '100%' }}>
                <List 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: {
                            xs: 'row', 
                            md: 'column'
                        },
                        width: '100%'
                    }}
                >
                    <ListItem>
                        <ListItemButton
                            selected={page === 0}
                            onClick={() => handleButton(0)}>
                            <ListItemText primary={'Cargar plan'} primaryTypographyProps={{ fontWeight: 'bold' }}/>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton
                            selected={page === 1}
                            onClick={() => handleButton(1)}>
                            <ListItemText primary={'Ajustes'} primaryTypographyProps={{ fontWeight: 'bold' }}/>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton
                            selected={page === 2}
                            onClick={() => handleButton(2)}>
                            <ListItemText primary={'Secretarías'} primaryTypographyProps={{ fontWeight: 'bold' }}/>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton
                            selected={page === 3}
                            onClick={() => handleButton(3)}>
                            <ListItemText primary={'Localidades'} primaryTypographyProps={{ fontWeight: 'bold' }}/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
}
