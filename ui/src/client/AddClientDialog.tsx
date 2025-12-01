import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';

interface IProps {
    fClose: VoidFunction;
    fOnSubmit: (name: string) => Promise<void>;
}

const AddClientDialog = ({fClose, fOnSubmit}: IProps) => {
    const [name, setName] = useState('');
    const { t } = useTranslation();

    const submitEnabled = name.length !== 0;
    const submitAndClose = async () => {
        await fOnSubmit(name);
        fClose();
    };

    return (
        <Dialog open={true} onClose={fClose} aria-labelledby="form-dialog-title" id="client-dialog">
            <DialogTitle id="form-dialog-title">{t('createClient')}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    className="name"
                    label={t('name') + " *"}
                    type="email"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={fClose}>{t('cancel')}</Button>
                <Tooltip placement={'bottom-start'} title={submitEnabled ? '' : t('nameIsRequired')}>
                    <div>
                        <Button
                            className="create"
                            disabled={!submitEnabled}
                            onClick={submitAndClose}
                            color="primary"
                            variant="contained">
                            {t('create')}
                        </Button>
                    </div>
                </Tooltip>
            </DialogActions>
        </Dialog>
    );
};

export default AddClientDialog;
