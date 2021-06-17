'use strict';

import './scss/style.scss';
import './pug/index.pug';
import { StopWatchTimer } from './ts/index';

const stopWatchTimer = new StopWatchTimer();
stopWatchTimer.init();
