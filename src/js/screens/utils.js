import { announcePageLoaded } from 'grommet/utils/Announcer';

const DEFAULT_TITLE = 'IoT Dashboard';

export function pageLoaded(title) {
  if (document) {
    if (title && typeof title === 'string') {
      title = `${DEFAULT_TITLE} | ${title}`;
    } else {
      title = DEFAULT_TITLE;
    }
    announcePageLoaded(title);
    document.title = title;
  }
}

export default { pageLoaded };
