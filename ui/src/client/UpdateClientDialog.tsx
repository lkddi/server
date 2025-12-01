import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';

interface IProps {
    fClose: VoidFunction;
    fOnSubmit: (name: string) => Promise<void>;
    initialName: string;
}

const UpdateClientDialog = ({fClose, fOnSubmit, initialName = ''}: IProps) => {
    const [name, setName] = useState(initialName);
    const { t } = useTranslation();

    const submitEnabled = name.length !== 0;
    const submitAndClose = async () => {
        await fOnSubmit(name);
        fClose();
    };

    return (
        <Dialog open={true} onClose={fClose} aria-labelledby="form-dialog-title" id="client-dialog">
            <DialogTitle id="form-dialog-title">{t('updateClient')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('clientDescription')}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    className="name"
                    label={t('nameField')}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={fClose}>{t('cancel')}</Button>
                <Tooltip title={submitEnabled ? '' : t('nameIsRequired')}>
                    <div>
                        <Button
                            className="update"
                            disabled={!submitEnabled}
                            onClick={submitAndClose}
                            color="primary"
                            variant="contained">
                            {t('update')}
                        </Button>
                    </div>
                </Tooltip>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateClientDialog;
