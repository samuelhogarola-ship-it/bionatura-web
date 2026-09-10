import { currentSeason } from '../domain/season';
import type { Season } from '../domain/catalog';

const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter'];

for (const selector of document.querySelectorAll<HTMLElement>('[data-season-selector]')) {
  const tablist = selector.querySelector<HTMLElement>('[data-season-tabs]');
  const tabs = Array.from(selector.querySelectorAll<HTMLButtonElement>('[data-season-tab]'));
  const panels = Array.from(selector.querySelectorAll<HTMLElement>('[data-season-panel]'));
  if (!tablist || tabs.length !== seasons.length || panels.length !== seasons.length) continue;

  selector.dataset.enhanced = 'true';
  tablist.setAttribute('role', 'tablist');

  const activate = (season: Season, moveFocus = false) => {
    for (const tab of tabs) {
      const active = tab.dataset.seasonTab === season;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      tab.querySelector<HTMLElement>('[data-current-season-label]')!.hidden = !active;
      if (active && moveFocus) tab.focus();
    }
    for (const panel of panels) {
      const active = panel.dataset.seasonPanel === season;
      panel.setAttribute('role', 'tabpanel');
      panel.tabIndex = 0;
      panel.hidden = !active;
    }
  };

  for (const tab of tabs) {
    tab.addEventListener('click', () => activate(tab.dataset.seasonTab as Season));
    tab.addEventListener('keydown', (event) => {
      const activeIndex = seasons.indexOf(tab.dataset.seasonTab as Season);
      let nextIndex: number | null = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (activeIndex + 1) % seasons.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (activeIndex - 1 + seasons.length) % seasons.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = seasons.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      activate(seasons[nextIndex], true);
    });
  }

  activate(currentSeason());
}
