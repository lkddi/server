import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import {NumberField} from '../common/NumberField';
import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
    fClose: VoidFunction;
    fOnSubmit: (name: string, description: string, defaultPriority: number) => Promise<void>;
}

export const AddApplicationDialog = ({fClose, fOnSubmit}: IProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [defaultPriority, setDefaultPriority] = useState(0);

    const { t } = useTranslation();
    const submitEnabled = name.length !== 0;
    const submitAndClose = async () => {
        await fOnSubmit(name, description, defaultPriority);
        fClose();
    };

    return (
        <Dialog open={true} onClose={fClose} aria-labelledby="form-dialog-title" id="app-dialog">
            <DialogTitle id="form-dialog-title">{t('createApplication')}</DialogTitle>
            <DialogContent>
                <DialogContentText>{t('applicationDescription')}</DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    className="name"
                    label={t('name') + " *"}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    className="description"
                    label={t('description')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                />
                <NumberField
                    margin="dense"
                    className="priority"
                    label={t('defaultPriority')}
                    value={defaultPriority}
                    onChange={(value) => setDefaultPriority(value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={fClose}>{t('cancel')}</Button>
                <Tooltip title={submitEnabled ? '' : t('nameIsRequired')}>
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
