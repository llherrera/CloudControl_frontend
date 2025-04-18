import { useEffect } from "react";

import { Drawer, Box, List, useMediaQuery, ListItem,
    ListItemButton, ListItemText } from '@mui/material';

import { DrawerProps, ListItemProps } from "@/interfaces";

export const DrawerMenu = ({children, height}: DrawerProps) => {

    useEffect(() => {
        const bar = document.getElementById('bar');
        bar?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, []);

    return (
        <Drawer
            PaperProps={{
                sx: {
                    display: 'flex',
                    background: '#E7E6E8',
                    flexDirection: { xs: 'row', md: 'column' },
                    width: {xs: '100%', md:'160px'},
                    height: {md: `${height == undefined ? '70%': height}`},
                    position: 'absolute',
                    top: { xs: '205px', sm: '205px', md: '220px', lg: '220px', xl: '102px', '2xl': '102px' },
                    left: { md: '0', xl: '11rem', '2xl': '12rem' },
                    border: '',
                    maxWidth: {
                        xs: '100%',
                        sm: '80%',
                        md: '60%',
                        lg: '50%',
                        xl: '40%',
                        '2xl': '40%',
                    },
                    minWidth: {
                        xs: '100%',
                        sm: '100%',
                        md: '10%',
                        lg: '10%',
                        xl: '10%',
                        '2xl': '8%'
                    },
                    maxHeight: {
                        xs: '80px',
                        sm: '80px',
                        md: `${height == undefined ? '70%': height}`,
                        lg: `${height == undefined ? '70%': height}`,
                        xl: `${height == undefined ? '70%': height}`,
                        '2xl': `${height == undefined ? '70%': height}`,
                    },
                    minHeight: {
                        xs: '80px',
                        sm: '80px',
                        md: `${height == undefined ? '70%': height}`,
                        lg: `${height == undefined ? '70%': height}`,
                        xl: `${height == undefined ? '70%': height}`,
                        '2xl': `${height == undefined ? '70%': height}`
                    },
                }
            }}
            variant="permanent"
            open={true}
            anchor={useMediaQuery('(min-width:768px)') ? 'left' : 'top'}>
            <div id="bar" className="tw-flex">
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
                        {children}
                    </List>
                </Box>
            </div>
        </Drawer>
    );
}

export const ListItemComp = ({title, page, index, setPage, setTitle}: ListItemProps) => {

    const handlePage = () => {
        setPage(page);
        setTitle ? setTitle(title) : null;
    };

    return(
        <ListItem>
            <ListItemButton
                selected={page === index}
                onClick={() => handlePage()}
                sx={{
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(0, 132, 50, 0.3)'
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: 'rgba(0, 132, 50, 0.5)',
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(0, 132, 50, 0.5)',
                    },
                }}>
                <ListItemText
                    primary={title}
                    primaryTypographyProps={{ fontWeight: 'bold' }}/>
            </ListItemButton>
        </ListItem>
    );
}