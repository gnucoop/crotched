/**
 * @license
 * Copyright Gnucoop soc. coop. All Rights Reserved.
 *
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file at https://gnucoop.io/crotched/LICENSE
 */

import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import {DateTime, Info} from 'luxon';

import {dayOfWeekDayOfYear} from './luxon-dow-doy';

declare const ngDevMode: any;

type DateTimeInput = string|Date|DateTime|{year: number, month: number, date: number};

/** Configurable options for {@see LuxonDateAdapter}. */
export interface MatLuxonDateAdapterOptions {
  /**
   * Turns the use of utc dates on or off.
   * Changing this will change how Angular Material components like DatePicker
   * output dates.
   * {@default false}
   */
  useUtc?: boolean;
}

/** InjectionToken for date-fns date adapter to configure options. */
export const MAT_LUXON_DATE_ADAPTER_OPTIONS = new InjectionToken<MatLuxonDateAdapterOptions>(
    'MAT_LUXON_DATE_ADAPTER_OPTIONS',
    {providedIn: 'root', factory: MAT_LUXON_DATE_ADAPTER_OPTIONS_FACTORY});

export function MAT_LUXON_DATE_ADAPTER_OPTIONS_FACTORY(): MatLuxonDateAdapterOptions {
  return {
    useUtc: false,
  };
}

/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

function normalizeWeeekdays(days: string[]): string[] {
  return [days[6], ...days.slice(0, 6)];
}

/** Adapts Luxon Dates for use with Angular Material. */
@Injectable()
export class LuxonDateAdapter extends DateAdapter<DateTime> {
  private _localeData!: {
    firstDayOfWeek: number,
    longMonths: string[],
    shortMonths: string[],
    dates: string[],
    longDaysOfWeek: string[],
    shortDaysOfWeek: string[],
    narrowDaysOfWeek: string[]
  };

  constructor(
      @Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string,
      @Optional() @Inject(MAT_LUXON_DATE_ADAPTER_OPTIONS) private _options?:
          MatLuxonDateAdapterOptions,
  ) {
    super();
    const curLocale = DateTime.now().resolvedLocaleOpts().locale;
    this.setLocale(dateLocale || curLocale);
  }

  setLocale(locale: string): void {
    super.setLocale(locale);
    if (locale === 'ja-JP') {
      this.locale = 'ja';
    }

    const dowDoy = dayOfWeekDayOfYear[locale];
    const firstDayOfWeek = dowDoy ? dowDoy[0] : 0;

    const opts = {locale};
    const weekdays = [
      normalizeWeeekdays(Info.weekdays('long', opts)),
      normalizeWeeekdays(Info.weekdays('short', opts)),
      normalizeWeeekdays(Info.weekdays('narrow', opts)),
    ];
    const longDaysOfWeek = [] as string[];
    const shortDaysOfWeek = [] as string[];
    const narrowDaysOfWeek = [] as string[];

    for (let i = 0; i < 7; i++) {
      const idx = (firstDayOfWeek + i) % 7;
      longDaysOfWeek.push(weekdays[0][idx]);
      shortDaysOfWeek.push(weekdays[1][idx]);
      narrowDaysOfWeek.push(weekdays[2][idx]);
    }

    this._localeData = {
      firstDayOfWeek,
      longMonths: this._getMonthNames('long', this.locale),
      shortMonths: this._getMonthNames('short', this.locale),
      dates: range(31, (i) => this.createDate(2017, 0, i + 1).toFormat('d', opts)),
      longDaysOfWeek,
      shortDaysOfWeek,
      narrowDaysOfWeek,
    };
  }

  getYear(date: DateTime): number {
    return date.year;
  }

  getMonth(date: DateTime): number {
    return date.month - 1;
  }

  getDate(date: DateTime): number {
    return date.day;
  }

  getDayOfWeek(date: DateTime): number {
    return date.weekday === 7 ? 0 : date.weekday - 1;
  }

  getMonthNames(style: 'long'|'short'|'narrow'): string[] {
    return this._getMonthNames(style, this.locale);
  }

  getDateNames(): string[] {
    return this._localeData.dates;
  }

  getDayOfWeekNames(style: 'long'|'short'|'narrow'): string[] {
    if (style === 'long') {
      return this._localeData.longDaysOfWeek;
    }
    if (style === 'short') {
      return this._localeData.shortDaysOfWeek;
    }
    return this._localeData.narrowDaysOfWeek;
  }

  getYearName(date: DateTime): string {
    return date.toFormat('yyyy', {locale: this.locale});
  }

  getFirstDayOfWeek(): number {
    return this._localeData.firstDayOfWeek;
  }

  getNumDaysInMonth(date: DateTime): number {
    return date.daysInMonth;
  }

  clone(date: DateTime): DateTime {
    return DateTime.fromMillis(date.toMillis(), {locale: this.locale});
  }

  createDate(year: number, month: number, date: number): DateTime {
    // Luxon will create an invalid date if any of the components are out of
    // bounds, but we explicitly check each case so we can throw more
    // descriptive errors.
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (month < 0 || month > 11) {
        throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
      }

      if (date < 1) {
        throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
      }
    }

    const result = this._createDateTime({year, month, date}).setLocale(this.locale);

    // If the result isn't valid, the date must have been out of bounds for this
    // month.
    if (!result.isValid && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result;
  }

  today(): DateTime {
    return this._createDateTime().setLocale(this.locale);
  }

  parse(value: any, parseFormat: string|string[]): DateTime|null {
    if (value && typeof value === 'string') {
      return this._createDateTime(value, parseFormat, this.locale);
    }
    return value ? this._createDateTime(value).setLocale(this.locale) : null;
  }

  format(date: DateTime, displayFormat: string): string {
    if (!this.isValid(date) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error('LuxonDateAdapter: Cannot format invalid date.');
    }
    return date.toFormat(displayFormat, {locale: this.locale});
  }

  addCalendarYears(date: DateTime, years: number): DateTime {
    return this.clone(date).plus({years});
  }

  addCalendarMonths(date: DateTime, months: number): DateTime {
    return this.clone(date).plus({months});
  }

  addCalendarDays(date: DateTime, days: number): DateTime {
    return this.clone(date).plus({days});
  }

  toIso8601(date: DateTime): string {
    return this.clone(date).toISO();
  }

  /**
   * Returns the given value if given a valid DateTime or null. Deserializes valid
   * ISO 8601 strings (https://www.ietf.org/rfc/rfc3339.txt) and valid Date
   * objects into valid DateTime and empty string into null. Returns an invalid
   * date for all other values.
   */
  deserialize(value: any): DateTime|null {
    let date;
    if (value instanceof Date) {
      date = this._createDateTime(value).setLocale(this.locale);
    } else if (this.isDateInstance(value)) {
      // Note: assumes that cloning also sets the correct locale.
      return this.clone(value);
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      date = this._createDateTime(value, 'ISO8601').setLocale(this.locale);
    }
    if (date && this.isValid(date)) {
      return this._createDateTime(date).setLocale(this.locale);
    }
    return super.deserialize(value);
  }

  isDateInstance(obj: any): boolean {
    return DateTime.isDateTime(obj);
  }

  isValid(date: DateTime): boolean {
    return date.isValid;
  }

  invalid(): DateTime {
    return DateTime.invalid('invalid');
  }

  /** Creates a DateTime instance while respecting the current UTC settings. */
  private _createDateTime(
      dateInput?: DateTimeInput,
      format?: string|string[],
      locale?: string,
      ): DateTime {
    const {useUtc}: MatLuxonDateAdapterOptions = this._options || {};
    const opts = {
      zone: useUtc ? 'UTC' : 'local',
      locale,
    };
    if (dateInput instanceof Date) {
      return DateTime.fromJSDate(dateInput, opts);
    }
    if (dateInput instanceof DateTime) {
      return DateTime.fromMillis(dateInput.toMillis(), opts);
    }
    if (typeof dateInput !== 'string') {
      const {year, date} = dateInput || {};
      let {month} = dateInput || {};
      if (month != null) {
        month += 1;
      }
      return useUtc ? DateTime.utc(year, month, date) : DateTime.local(year, month, date);
    }
    if (typeof format === 'string') {
      if (format === 'ISO8601') {
        return DateTime.fromISO(dateInput, opts);
      }
      return DateTime.fromFormat(dateInput, format, opts);
    }
    if (Array.isArray(format)) {
      const formatsNum = format.length;
      for (let i = 0; i < formatsNum; i++) {
        const fmt = format[i];
        const parsed = DateTime.fromFormat(dateInput, fmt, opts);
        if (parsed.isValid || i === formatsNum - 1) {
          return parsed;
        }
      }
    }
    return DateTime.fromISO(dateInput, opts);
  }

  private _getMonthNames(type: 'long'|'short'|'narrow', locale: string): string[] {
    const names = Info.months(type, {locale});
    if (locale === 'ja') {
      return names.map(month => `${month}月`);
    }
    return names;
  }
}
