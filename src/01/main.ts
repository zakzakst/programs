'use strict';

import './scss/style.scss';
import './pug/index.pug';
import { Janken } from './ts/index';

const janken = new Janken();
janken.init();
