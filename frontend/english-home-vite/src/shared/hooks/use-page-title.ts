import React from 'react';
import { useTranslation } from 'react-i18next';

const usePageTitle = (title: string, template?: string) => {
  const { t } = useTranslation();
  const resolvedTemplate = template || t('Global.englishom');
  React.useEffect(() => {
    document.title = `${title} - ${resolvedTemplate}`;
  }, [title, resolvedTemplate]);

  return title;
};

export default usePageTitle;
