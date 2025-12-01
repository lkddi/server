import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
    name?: string;
    fClose: VoidFunction;
    fOnSubmit: (name: string, pass: string) => Promise<boolean>;
}

const RegistrationDialog = ({fClose, fOnSubmit, name: initialName = ''}: IProps) => {
    const [name, setName] = React.useState(initialName);
    const [pass, setPass] = React.useState('');
    const { t } = useTranslation();
    const namePresent = name.length !== 0;
    const passPresent = pass.length !== 0;

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPass(e.target.value);
    };

    const submitAndClose = (): void => {
        fOnSubmit(name, pass).then((success) => {
            if (success) {
                fClose();
            }
        });
    };

    return (
        <Dialog
            open={true}
            onClose={fClose}
            aria-labelledby="form-dialog-title"
            id="add-edit-user-dialog">
            <DialogTitle id="form-dialog-title">{t('registration')}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    id="register-username"
                    margin="dense"
                    className="name"
                    label={t('usernameField')}
                    name="username"
                    value={name}
                    autoComplete="username"
                    onChange={handleNameChange}
                    fullWidth
                />
                <TextField
                    id="register-password"
                    margin="dense"
                    className="password"
                    type="password"
                    value={pass}
                    fullWidth
                    label={t('passwordField')}
                    name="password"
                    autoComplete="new-password"
                    onChange={handlePassChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={fClose}>{t('cancel')}</Button>
                <Tooltip
                    placement={'bottom-start'}
                    title={
                        namePresent
                            ? passPresent
                                ? ''
                                : t('passwordRequired')
                            : t('usernameRequired')
                    }>
                    <div>
                        <Button
                            className="save-create"
                            disabled={!passPresent || !namePresent}
                            onClick={submitAndClose}
                            color="primary"
                            variant="contained">
                            {t('register')}
                        </Button>
                    </div>
                </Tooltip>
            </DialogActions>
        </Dialog>
    );
};
export default RegistrationDialog;
