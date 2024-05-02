import React from 'react';
import {useTranslation} from 'react-i18next';
import {useSiteInfo, useNodeInfo} from '@jahia/data-helper';
import {useSelector} from 'react-redux';

export const RequestDeeplTranslationFromAction = ({path, render: Render, ...otherProps}) => {
    const {t} = useTranslation('translation-deepl');
    const {language, site} = useSelector(state => ({language: state.language, site: state.site}));
    const {siteInfo, loading} = useSiteInfo({siteKey: site, displayLanguage: language});
    const {node, nodeLoading: nodeLoading} = useNodeInfo({path: path, language: language}, {getDisplayName: true});


    if (loading || !siteInfo || nodeLoading || !node) {
        return null;
    }

    return siteInfo.languages.filter(lang => lang.language !== language).map(lang => (
        <Render {...otherProps}
                buttonLabel={t('label.requestTranslation', {
                    languageDisplay: lang.displayName,
                    displayName: node.displayName
                })}
                onClick={async () => {
                    const formData = new FormData();
                    formData.append('subTree', otherProps.subTree);
                    formData.append('allLanguages', otherProps.allLanguages);
                    formData.append('destLanguage', lang.language);
                    const response = await fetch(`${contextJsParameters.contextPath}/cms/editframe/default/${language}${path}.requestTranslationAction.do`, {
                        method: 'POST',
                        body: formData
                    });
                }
                }
        />
    ))
};
