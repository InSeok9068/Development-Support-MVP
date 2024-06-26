import { useSettingStore } from '@/stores/setting.store';
import { storeToRefs } from 'pinia';

export const useSetting = () => {
  const { setting } = storeToRefs(useSettingStore());

  const toggleTheme = () => {
    setting.value.theme = setting.value.theme === 'white' ? 'dark' : 'white';
    document.documentElement.setAttribute('data-theme', setting.value.theme);
  };

  const initTheme = () => {
    document.documentElement.setAttribute('data-theme', setting.value.theme);
  };

  return {
    setting,
    toggleTheme,
    initTheme,
  };
};
