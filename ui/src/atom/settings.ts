import * as AutoStart from '@tauri-apps/plugin-autostart';
import { atom } from 'jotai';
import { ipc } from '~/ipc';
import type { Settings } from '~/types';
import { collectTrayClipItems } from '~/utils/common';
import { updateAutoStartItemChecked, updateTrayMenuItems } from '~/utils/tray';
import { clipItemsAtom, hostNameAtom, settingsAtom } from './primitive';

async function setAutoStart(autoStart: boolean) {
  const isEnabled = await AutoStart.isEnabled();
  if (autoStart && !isEnabled) {
    await AutoStart.enable();
    return true;
  }
  if (!autoStart && isEnabled) {
    await AutoStart.disable();
    return false;
  }
  return autoStart;
}

export const updateSettingsAtom = atom(null, (get, set, value: Settings) => {
  const old = get(settingsAtom);
  set(settingsAtom, value);
  if (old.trayItemsCount !== value.trayItemsCount) {
    const items = get(clipItemsAtom);
    const textClipItems = collectTrayClipItems(items, value.trayItemsCount);
    updateTrayMenuItems(textClipItems);
  }
  if (old.autoStart !== value.autoStart) {
    setAutoStart(value.autoStart).then((v) => {
      set(settingsAtom, (old) => ({ ...old, autoStart: v }));
      updateAutoStartItemChecked(v);
    });
  }
});

export const initSettingsAtom = atom(null, async (get, set) => {
  const isEnabled = await AutoStart.isEnabled();
  set(settingsAtom, (old) => ({ ...old, autoStart: isEnabled }));
  const settings = get(settingsAtom);
  let name = settings.name;
  if (!name) {
    name = await ipc.getHostName();
    set(settingsAtom, (old) => ({ ...old, name }));
    set(hostNameAtom, name);
  }
  if (settings.server) {
    await ipc.startServer(settings.id, settings.port, name);
  }
});

export const handleTrayToggleAutoStartAtom = atom(null, async (get, set) => {
  const settings = get(settingsAtom);
  const enabled = await setAutoStart(!settings.autoStart);
  set(settingsAtom, (old) => ({ ...old, autoStart: enabled }));
  updateAutoStartItemChecked(enabled);
});
