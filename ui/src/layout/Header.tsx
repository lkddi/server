import AppBar from '@mui/material/AppBar';
import Button, {ButtonProps} from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {Theme} from '@mui/material/styles';
import {makeStyles} from 'tss-react/mui';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Chat from '@mui/icons-material/Chat';
import DevicesOther from '@mui/icons-material/DevicesOther';
import ExitToApp from '@mui/icons-material/ExitToApp';
import Highlight from '@mui/icons-material/Highlight';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuIcon from '@mui/icons-material/Menu';
import Apps from '@mui/icons-material/Apps';
import SupervisorAccount from '@mui/icons-material/SupervisorAccount';
import Language from '@mui/icons-material/Language';
import React, {CSSProperties} from 'react';
import {Link} from 'react-router-dom';
import {useMediaQuery} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const useStyles = makeStyles()((theme: Theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        [theme.breakpoints.down('sm')]: {
            paddingBottom: 10,
        },
    },
    toolbar: {
        justifyContent: 'space-between',
        [theme.breakpoints.down('sm')]: {
            flexWrap: 'wrap',
        },
    },
    menuButtons: {
        display: 'flex',
        [theme.breakpoints.down('md')]: {
            flex: 1,
        },
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            flexBasis: '100%',
            marginTop: 5,
            order: 1,
            height: 50,
            justifyContent: 'space-between',
            alignItems: 'center',
        },
    },
    title: {
        [theme.breakpoints.up('md')]: {
            flex: 1,
        },
        display: 'flex',
        alignItems: 'center',
    },
    titleName: {
        paddingRight: 10,
    },
    link: {
        color: 'inherit',
        textDecoration: 'none',
    },
}));

interface IProps {
    loggedIn: boolean;
    name: string;
    admin: boolean;
    version: string;
    toggleTheme: VoidFunction;
    showSettings: VoidFunction;
    logout: VoidFunction;
    style: CSSProperties;
    setNavOpen: (open: boolean) => void;
}

const Header = ({
    version,
    name,
    loggedIn,
    admin,
    toggleTheme,
    logout,
    style,
    setNavOpen,
    showSettings,
}: IProps) => {
    const {classes} = useStyles();
    const { t } = useTranslation();

    return (
        <AppBar
            sx={{position: {xs: 'sticky', sm: 'fixed'}}}
            style={style}
            className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
                <div className={classes.title}>
                    <Link to="/" className={classes.link}>
                        <Typography variant="h5" className={classes.titleName} color="inherit">
                            {t('appName')}
                        </Typography>
                    </Link>
                    <a
                        href={'https://github.com/gotify/server/releases/tag/v' + version}
                        className={classes.link}>
                        <Typography variant="button" color="inherit">
                            @{version}
                        </Typography>
                    </a>
                </div>
                {loggedIn && (
                    <Buttons
                        admin={admin}
                        name={name}
                        logout={logout}
                        setNavOpen={setNavOpen}
                        showSettings={showSettings}
                    />
                )}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <LanguageSwitcher />
                    <IconButton onClick={toggleTheme} color="inherit" size="large">
                        <Highlight />
                    </IconButton>
                    <a
                        href="https://github.com/gotify/server"
                        className={classes.link}
                        target="_blank"
                        rel="noopener noreferrer">
                        <IconButton color="inherit" size="large">
                            <GitHubIcon />
                        </IconButton>
                    </a>
                </div>
            </Toolbar>
        </AppBar>
    );
};

const Buttons = ({
    showSettings,
    name,
    admin,
    logout,
    setNavOpen,
}: {
    name: string;
    admin: boolean;
    logout: VoidFunction;
    setNavOpen: (open: boolean) => void;
    showSettings: VoidFunction;
}) => {
    const {classes} = useStyles();
    const { t } = useTranslation();

    return (
        <div className={classes.menuButtons}>
            <ResponsiveButton
                sx={{display: {sm: 'none', xs: 'block'}}}
                icon={<MenuIcon />}
                onClick={() => setNavOpen(true)}
                label={t('menu')}
                color="inherit"
            />
            {admin && (
                <Link className={classes.link} to="/users" id="navigate-users">
                    <ResponsiveButton icon={<SupervisorAccount />} label={t('users')} color="inherit" />
                </Link>
            )}
            <Link className={classes.link} to="/applications" id="navigate-apps">
                <ResponsiveButton icon={<Chat />} label={t('applications')} color="inherit" />
            </Link>
            <Link className={classes.link} to="/clients" id="navigate-clients">
                <ResponsiveButton icon={<DevicesOther />} label={t('clients')} color="inherit" />
            </Link>
            <Link className={classes.link} to="/plugins" id="navigate-plugins">
                <ResponsiveButton icon={<Apps />} label={t('plugins')} color="inherit" />
            </Link>
            <ResponsiveButton
                icon={<AccountCircle />}
                label={name}
                onClick={showSettings}
                id="changepw"
                color="inherit"
            />
            <ResponsiveButton
                icon={<ExitToApp />}
                label={t('logout')}
                onClick={logout}
                id="logout"
                color="inherit"
            />
        </div>
    );
};

const ResponsiveButton: React.FC<{
    color: 'inherit';
    sx?: ButtonProps['sx'];
    label: string;
    id?: string;
    onClick?: () => void;
    icon: React.ReactNode;
}> = ({icon, label, ...rest}) => {
    const matches = useMediaQuery('(max-width:1000px)');
    if (matches) {
        return (
            <IconButton {...rest} size="large">
                {icon}
            </IconButton>
        );
    }
    return (
        <Button startIcon={icon} {...rest}>
            {label}
        </Button>
    );
};

// 定义语言配置
const languages = [
  { code: 'en', nativeName: 'English' },
  { code: 'zh', nativeName: '中文简体' },
  { code: 'zh-Hant', nativeName: '中文繁體' }
];

const LanguageSwitcher = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { i18n } = useTranslation();
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        handleClose();
    };

    return (
        <div>
            <IconButton
                onClick={handleClick}
                color="inherit"
                size="large"
                aria-label="change language"
                aria-controls="language-menu"
                aria-haspopup="true"
            >
                <Language />
            </IconButton>
            <Menu
                id="language-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    style: {
                        width: '20ch',
                    },
                }}
            >
                {languages.map((lang) => (
                    <MenuItem
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        selected={i18n.language === lang.code || i18n.language.startsWith(lang.code.split('-')[0])}
                    >
                        {lang.nativeName}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export default Header;
