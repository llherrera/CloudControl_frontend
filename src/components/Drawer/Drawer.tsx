import { useEffect } from "react";

import {
    Drawer,
    Box,
    List,
    useMediaQuery,
    ListItem,
    ListItemButton,
    ListItemText } from '@mui/material';

interface Props {
    children: JSX.Element[];
    height?: string;
}

interface ListProps {
    title: string;
    page: number;
    index: number;
    setPage: (page: number) => void;
    setTitle?: (title: string) => void;
}

export const DrawerMenu = ({children, height}:Props) => {

    useEffect(() => {
        const bar = document.getElementById('bar');
        bar?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, []);

    return (
        <Drawer
            PaperProps={{
                sx: {
                    display: 'flex',
                    flexDirection: { xs: 'row', md: 'column' },
                    width: {xs: '100%', md:'160px'},
                    height: {md: `${height == undefined ? '70%': height}`},
                    position: 'absolute',
                    top: { xs: '235px', md: '250px', lg: '250px', xl: '142px' },
                    left: { md: '0', xl: '10rem', '2xl': '12rem' },
                    border: '',
                    maxWidth: {
                        xs: '100%',
                        sm: '80%',
                        md: '60%',
                        lg: '50%',
                        xl: '40%',
                        '2xl': '30%',
                    },
                    minWidth: {
                        xs: '100%',
                        sm: '100%',
                        md: '10%',
                        lg: '10%',
                        xl: '10%',
                        '2xl': '10%'
                    },
                    maxHeight: {
                        xs: '15%',
                        sm: '15%',
                        md: `${height == undefined ? '70%': height}`,
                        lg: `${height == undefined ? '70%': height}`,
                        xl: `${height == undefined ? '70%': height}`,
                        '2xl': `${height == undefined ? '70%': height}`,
                    },
                    minHeight: {
                        xs: '15%',
                        sm: '15%',
                        md: `${height == undefined ? '70%': height}`,
                        lg: `${height == undefined ? '70%': height}`,
                        xl: `${height == undefined ? '70%': height}`,
                        '2xl': `${height == undefined ? '70%': height}`
                    },
                }
            }}
            variant="permanent"
            anchor={useMediaQuery('(min-width:768px)') ? 'left' : 'top'}
            >
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

export const ListItemComp = ({title, page, index, setPage, setTitle}: ListProps) => {

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