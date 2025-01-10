import React, { useState, createContext, useContext } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import TapItem from '../components/TapItem';
import { tapItems } from '../utils/constants';

interface ThemeContextType {
    isDarkTheme: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    isDarkTheme: true,
    toggleTheme: () => {},
});

const Header: React.FC = () => {
    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);

    const toggleTheme = () => {
        setIsDarkTheme((prev) => !prev);
    };

    const theme = createTheme({
        palette: {
            mode: isDarkTheme ? 'dark' : 'light',
        },
    });

    return (
        <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                    <div className="flex justify-center items-center gap-10 mt-6">
                        {tapItems.map((item, index) => {
                            return (
                                <TapItem key={index} title={item.title} icon={item.icon} />
                            )
                        })}
                    </div>
                    <ToggleButton />
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

const ToggleButton: React.FC = () => {
    const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

    return (
        <div className="absolute top-4 right-4">
            <IconButton onClick={toggleTheme} color="inherit">
                {isDarkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </div>
    );
};

export default Header;
