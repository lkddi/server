import React, {useState} from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {observer} from 'mobx-react-lite';
import DefaultPage from '../common/DefaultPage';
import ElevationForm from '../common/ElevationForm';
import {ThemeKey} from '../layout/theme';
import {useStores} from '../stores';
import * as config from '../config';

interface IProps {
    themeMode: ThemeKey;
    setTheme: (theme: ThemeKey) => void;
}

const Settings = observer(({themeMode, setTheme}: IProps) => {
    const [pass, setPass] = useState('');
    const {currentUser, elevateStore} = useStores();
    const localAuthEnabled = config.get('localAuth');

    const submit = () => {
        currentUser.changePassword(pass);
        setPass('');
    };

    return (
        <DefaultPage title="Settings" maxWidth={400}>
            <Grid size={{xs: 12}}>
                <Paper elevation={6} sx={{padding: 2}}>
                    <Typography variant="h6" sx={{marginBottom: 2}}>
                        Appearance
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel id="theme-select-label">Theme</InputLabel>
                        <Select
                            labelId="theme-select-label"
                            className="theme-select"
                            label="Theme"
                            value={themeMode}
                            onChange={(e) => setTheme(e.target.value)}>
                            <MenuItem value="light">Light</MenuItem>
                            <MenuItem value="dark">Dark</MenuItem>
                            <MenuItem value="system">System</MenuItem>
                        </Select>
                    </FormControl>
                </Paper>
            </Grid>
            <Grid size={{xs: 12}}>
                <Paper elevation={6} sx={{padding: 2}} id="changepw-form">
                    <Typography variant="h6" sx={{marginBottom: 2}}>
                        Change Password
                    </Typography>
                    {localAuthEnabled && !elevateStore.elevated ? (
                        <ElevationForm />
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                submit();
                            }}>
                            <TextField
                                className="newpass"
                                margin="dense"
                                type="password"
                                label="New Password *"
                                value={pass}
                                disabled={!localAuthEnabled}
                                onChange={(e) => setPass(e.target.value)}
                                fullWidth
                            />
                            <Tooltip
                                title={
                                    !localAuthEnabled
                                        ? 'Password login is disabled on this server.'
                                        : pass.length !== 0
                                          ? ''
                                          : 'Password is required'
                                }>
                                <div>
                                    <Button
                                        className="change"
                                        type="submit"
                                        disabled={!localAuthEnabled || pass.length === 0}
                                        color="primary"
                                        variant="contained"
                                        fullWidth>
                                        Change
                                    </Button>
                                </div>
                            </Tooltip>
                        </form>
                    )}
                </Paper>
            </Grid>
        </DefaultPage>
    );
});

export default Settings;
