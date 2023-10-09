import "isomorphic-fetch";
import path from 'path';
import 'aurelia-polyfills';
import {Options} from 'aurelia-loader-nodejs';

import {initialize} from 'aurelia-pal-browser';
initialize();

Options.relativeToDir = path.join(__dirname, 'unit');
