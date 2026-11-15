// The lab theme. `astryx experimental theme editor` wrote this file once and never changes it again.
// The checked settings live in lab.settings.json and the generated lab.settings.ts;
// change them with `astryx experimental theme editor set lab ...`. Add your own changes below: they win over the settings.
import {defineTheme} from '@astryxdesign/core/theme';
import {labSettings} from './lab.settings';

export const labTheme = defineTheme({
  extends: labSettings,
  name: 'lab',
});
