/**
 * @license
 * Copyright Gnucoop soc. coop. All Rights Reserved.
 *
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file at https://gnucoop.io/crotched/LICENSE
 */

import {MatDateFormats} from '@angular/material/core';

export const MAT_LUXON_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'D',
  },
  display: {
    dateInput: 'D',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'DDD',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};
