import { Languages } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from '~/components';
import { SelectIconTrigger } from '~/components/one-select';
import { Langs } from '~/consts';
import { cn } from '~/utils/cn';
import { storage } from '~/utils/storage';
import { changeTrayMenuLanguage } from '~/utils/tray';
import { SettingsDialog } from './settings';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <div
      className={cn(
        'w-full h-11 flex items-center px-4 py-1 border-b border-border/50 dark:border-border',
        PLATFORM === 'darwin' ? 'justify-center relative' : 'justify-between',
      )}
      data-tauri-drag-region={PLATFORM === 'darwin' ? true : undefined}
    >
      <div className="flex items-center gap-1">
        <img className="size-8" src="/icon.ico" alt="app logo icon" />
        <span className="font-serif text-lg">{PKG_NAME}</span>
      </div>
      <div
        className={cn(
          'flex items-center gap-1.5',
          PLATFORM === 'darwin' && 'absolute right-4',
        )}
      >
        <ChangeLanguageButton />
        <ThemeToggle />
        <SettingsDialog />
      </div>
    </div>
  );
}

function ChangeLanguageButton() {
  const { i18n } = useTranslation();
  const [value, setValue] = useState(i18n.language);

  const handleLanguageChange = async (v: string) => {
    await i18n.changeLanguage(v);
    setValue(v);
    storage.setLanguage(v);
    document.documentElement.lang = v;
    await changeTrayMenuLanguage();
  };

  return (
    <Select
      trigger={
        <SelectIconTrigger>
          <Languages />
        </SelectIconTrigger>
      }
      value={value}
      onChange={handleLanguageChange}
      options={[
        { label: 'English', value: Langs.En },
        { label: '简体中文', value: Langs.Zh },
      ]}
    />
  );
}
