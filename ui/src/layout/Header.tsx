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
import MenuIcon from '@mui/icons-material/Menu';
import Apps from '@mui/icons-material/Apps';
import SupervisorAccount from '@mui/icons-material/SupervisorAccount';
import React, {CSSProperties} from 'react';
import {Link} from 'react-router';
import {useMediaQuery} from '@mui/material';

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
    logout: VoidFunction;
    style: CSSProperties;
    setNavOpen: (open: boolean) => void;
}

const Header = ({version, name, loggedIn, admin, logout, style, setNavOpen}: IProps) => {
    const {classes} = useStyles();
    return (
        <AppBar
            sx={{position: {xs: 'sticky', sm: 'fixed'}}}
            style={style}
            className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
                <div className={classes.title}>
                    <Link to="/" className={classes.link}>
                        <Typography variant="h5" className={classes.titleName} color="inherit">
                            Gotify
                        </Typography>
                    </Link>
                    <a
                        href={
                            version.startsWith('master-')
                                ? `https://github.com/gotify/server/commit/${version.replace('master-', '')}`
                                : `https://github.com/gotify/server/releases/tag/v${version}`
                        }
                        className={classes.link}>
                        <Typography variant="button" color="inherit">
                            @{version}
                        </Typography>
                    </a>
                </div>
                {loggedIn && (
                    <Buttons admin={admin} name={name} logout={logout} setNavOpen={setNavOpen} />
                )}
            </Toolbar>
        </AppBar>
    );
};

const Buttons = ({
    name,
    admin,
    logout,
    setNavOpen,
}: {
    name: string;
    admin: boolean;
    logout: VoidFunction;
    setNavOpen: (open: boolean) => void;
}) => {
    const {classes} = useStyles();

    return (
        <div className={classes.menuButtons}>
            <ResponsiveButton
                sx={{display: {sm: 'none', xs: 'block'}}}
                icon={<MenuIcon />}
                onClick={() => setNavOpen(true)}
                label="menu"
                color="inherit"
            />
            {admin && (
                <Link className={classes.link} to="/users" id="navigate-users">
                    <ResponsiveButton icon={<SupervisorAccount />} label="users" color="inherit" />
                </Link>
            )}
            <Link className={classes.link} to="/applications" id="navigate-apps">
                <ResponsiveButton icon={<Chat />} label="apps" color="inherit" />
            </Link>
            <Link className={classes.link} to="/clients" id="navigate-clients">
                <ResponsiveButton icon={<DevicesOther />} label="clients" color="inherit" />
            </Link>
            <Link className={classes.link} to="/plugins" id="navigate-plugins">
                <ResponsiveButton icon={<Apps />} label="plugins" color="inherit" />
            </Link>
            <Link className={classes.link} to="/settings" id="navigate-settings">
                <ResponsiveButton icon={<AccountCircle />} label={name} color="inherit" />
            </Link>
            <ResponsiveButton
                icon={<ExitToApp />}
                label="Logout"
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

export default Header;
