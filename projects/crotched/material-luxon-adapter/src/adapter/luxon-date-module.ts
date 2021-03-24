/**
 * @license
 * Copyright Gnucoop soc. coop. All Rights Reserved.
 *
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file at https://gnucoop.io/crotched/LICENSE
 */

import {NgModule} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import {LuxonDateAdapter, MAT_LUXON_DATE_ADAPTER_OPTIONS} from './luxon-date-adapter';
import {MAT_LUXON_DATE_FORMATS} from './luxon-date-formats';

@NgModule({
  providers: [{
    provide: DateAdapter,
    useClass: LuxonDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_LUXON_DATE_ADAPTER_OPTIONS],
  }],
})
export class LuxonDateModule {
}

@NgModule({
  imports: [LuxonDateModule],
  providers: [{provide: MAT_DATE_FORMATS, useValue: MAT_LUXON_DATE_FORMATS}],
})
export class MatLuxonDateModule {
}
