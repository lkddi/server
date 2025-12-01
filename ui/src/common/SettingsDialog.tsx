import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import {observer} from 'mobx-react-lite';
import {useStores} from '../stores';
import { useTranslation } from 'react-i18next';

interface IProps {
    fClose: VoidFunction;
}

const SettingsDialog = observer(({fClose}: IProps) => {
    const [pass, setPass] = useState('');
    const {currentUser} = useStores();
    const { t } = useTranslation();

    const submitAndClose = async () => {
        currentUser.changePassword(pass);
        fClose();
    };

    return (
        <Dialog
            open={true}
            onClose={fClose}
            aria-labelledby="form-dialog-title"
            id="changepw-dialog">
            <DialogTitle id="form-dialog-title">{t('changePassword')}</DialogTitle>
            <DialogContent>
                <TextField
                    className="newpass"
                    autoFocus
                    margin="dense"
                    type="password"
                    label={t('newPassword')}
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={fClose}>{t('cancel')}</Button>
                <Tooltip title={pass.length !== 0 ? '' : t('passwordRequired')}>
                    <div>
                        <Button
                            className="change"
                            disabled={pass.length === 0}
                            onClick={submitAndClose}
                            color="primary"
                            variant="contained">
                            {t('save')}
                        </Button>
                    </div>
                </Tooltip>
            </DialogActions>
        </Dialog>
    );
});

export default SettingsDialog;
