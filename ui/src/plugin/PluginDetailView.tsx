import React from 'react';
import {useParams} from 'react-router';
import {Markdown} from '../common/Markdown';
import {material} from '@uiw/codemirror-theme-material';
import CodeMirror from '@uiw/react-codemirror';
import Info from '@mui/icons-material/Info';
import Build from '@mui/icons-material/Build';
import Subject from '@mui/icons-material/Subject';
import Refresh from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DefaultPage from '../common/DefaultPage';
import * as config from '../config';
import Container from '../common/Container';
import {IPlugin} from '../types';
import LoadingSpinner from '../common/LoadingSpinner';
import {useStores} from '../stores';
import { useTranslation } from 'react-i18next';

const PluginDetailView = () => {
    const {id} = useParams<{id: string}>();
    const pluginID = parseInt(id as string, 10);
    const {pluginStore} = useStores();
    const { t } = useTranslation();
    const [currentConfig, setCurrentConfig] = React.useState<string>();
    const [displayText, setDisplayText] = React.useState<string>();

    const pluginInfo = pluginStore.getByIDOrUndefined(pluginID);

    const refreshFeatures = async () => {
        await pluginStore.refreshIfMissing(pluginID);
        await Promise.all([refreshConfigurer(), refreshDisplayer()]);
    };

    React.useEffect(() => void refreshFeatures(), [pluginID]);

    const refreshConfigurer = async () => {
        if (pluginInfo?.capabilities.indexOf('configurer') !== -1) {
            setCurrentConfig(await pluginStore.requestConfig(pluginID));
        }
    };

    const refreshDisplayer = async () => {
        if (pluginInfo?.capabilities.indexOf('displayer') !== -1) {
            setDisplayText(await pluginStore.requestDisplay(pluginID));
        }
    };

    if (pluginInfo == null) {
        return <LoadingSpinner />;
    }

    const handleSaveConfig = async (newConfig: string) => {
        await pluginStore.changeConfig(pluginID, newConfig);
        await refreshFeatures();
    };

    return (
        <DefaultPage title={pluginInfo.name} maxWidth={1000}>
            <PanelWrapper name={t('pluginInfo')} icon={Info}>
                <PluginInfo pluginInfo={pluginInfo} t={t} />
            </PanelWrapper>
            {pluginInfo.capabilities.indexOf('configurer') !== -1 ? (
                <PanelWrapper
                    name={t('configurer')}
                    description={t('configurerDescription')}
                    icon={Build}
                    refresh={refreshConfigurer}>
                    <ConfigurerPanel
                        pluginInfo={pluginInfo}
                        initialConfig={currentConfig != null ? currentConfig : t('loading')}
                        save={handleSaveConfig}
                        t={t}
                    />
                </PanelWrapper>
            ) : null}{' '}
            {pluginInfo.capabilities.indexOf('displayer') !== -1 ? (
                <PanelWrapper
                    name={t('displayer')}
                    description={t('displayerDescription')}
                    refresh={refreshDisplayer}
                    icon={Subject}>
                    <DisplayerPanel
                        pluginInfo={pluginInfo}
                        displayText={displayText != null ? displayText : t('loading')}
                        t={t}
                    />
                </PanelWrapper>
            ) : null}
        </DefaultPage>
    );
};

interface IPanelWrapperProps {
    name: string;
    description?: string;
    refresh?: () => Promise<void>;
    icon?: React.ComponentType;
}

const PanelWrapper: React.FC<React.PropsWithChildren<IPanelWrapperProps>> = ({
    name,
    description,
    refresh,
    icon,
    children,
}) => {
    const Icon = icon;
    return (
        <div
            style={{
                width: '100%',
                paddingLeft: '16px',
                paddingRight: '16px',
            }}>
            <Container
                style={{
                    display: 'block',
                    width: '100%',
                    margin: '12px 0px',
                }}>
                <Typography variant="h5">
                    {Icon ? (
                        <span>
                            <Icon />
                            &nbsp;
                        </span>
                    ) : null}
                    {name}
                    {refresh ? (
                        <Button
                            style={{float: 'right'}}
                            onClick={() => {
                                refresh();
                            }}>
                            <Refresh />
                        </Button>
                    ) : null}
                </Typography>
                {description ? <Typography variant="subtitle1">{description}</Typography> : null}
                <hr />
                <div className={name.toLowerCase().trim().replace(/ /g, '-')}>{children}</div>
            </Container>
        </div>
    );
};

interface IConfigurerPanelProps {
    pluginInfo: IPlugin;
    initialConfig: string;
    save: (newConfig: string) => Promise<void>;
    t: any;
}
const ConfigurerPanel = ({initialConfig, save, t}: IConfigurerPanelProps) => {
    const [unsavedChanges, setUnsavedChanges] = React.useState<string | null>(null);
    const onChange = React.useCallback(
        (value: string | null) => {
            let newConf: string | null = value;
            if (value === initialConfig) {
                newConf = null;
            }
            setUnsavedChanges(newConf);
        },
        [initialConfig]
    );
    return (
        <div>
            <CodeMirror value={initialConfig} theme={material} onChange={onChange} />
            <br />
            <Button
                variant="contained"
                color="primary"
                fullWidth={true}
                disabled={unsavedChanges === null || unsavedChanges === initialConfig}
                className="config-save"
                onClick={() => {
                    const newConfig = unsavedChanges;
                    save(newConfig!).then(() => {
                        setUnsavedChanges(null);
                    });
                }}>
                <Typography variant="button">{t('saveButton')}</Typography>
            </Button>
        </div>
    );
};

interface IDisplayerPanelProps {
    pluginInfo: IPlugin;
    displayText: string;
    t: any;
}
const DisplayerPanel: React.FC<IDisplayerPanelProps> = ({displayText, t}) => (
    <Typography variant="body2">
        <Markdown>{displayText}</Markdown>
    </Typography>
);

interface IPluginInfo {
    pluginInfo: IPlugin;
    t: any;
}

const PluginInfo = ({pluginInfo, t}: IPluginInfo) => {
    const {name, author, modulePath, website, license, capabilities, id, token} = pluginInfo;

    return (
        <div style={{wordWrap: 'break-word'}}>
            {name ? (
                <Typography variant="body2" className="name">
                    {t('nameLabel')} <span>{name}</span>
                </Typography>
            ) : null}
            {author ? (
                <Typography variant="body2" className="author">
                    {t('authorLabel')} <span>{author}</span>
                </Typography>
            ) : null}
            <Typography variant="body2" className="module-path">
                {t('modulePathLabel')} <span>{modulePath}</span>
            </Typography>
            {website ? (
                <Typography variant="body2" className="website">
                    {t('websiteLabel')} <span>{website}</span>
                </Typography>
            ) : null}
            {license ? (
                <Typography variant="body2" className="license">
                    {t('licenseLabel')} <span>{license}</span>
                </Typography>
            ) : null}
            <Typography variant="body2" className="capabilities">
                {t('capabilitiesLabel')} <span>{capabilities.join(', ')}</span>
            </Typography>
            {capabilities.indexOf('webhooker') !== -1 ? (
                <Typography variant="body2">
                    {t('customRoutePrefix')}:{' '}
                    {((url) => (
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="custom-route">
                            {url}
                        </a>
                    ))(`${config.get('url')}plugin/${id}/custom/${token}/`)}
                </Typography>
            ) : null}
        </div>
    );
};

export default PluginDetailView;
