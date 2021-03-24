/**
 * @license
 * Copyright Gnucoop soc. coop. All Rights Reserved.
 *
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file at https://gnucoop.io/crotched/LICENSE
 */

import {LOCALE_ID} from '@angular/core';
import {inject, TestBed, waitForAsync} from '@angular/core/testing';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import {DateTime, Settings} from 'luxon';

import {LuxonDateModule} from './index';
import {LuxonDateAdapter, MAT_LUXON_DATE_ADAPTER_OPTIONS} from './luxon-date-adapter';

const JAN = 1;
const FEB = 2;
const MAR = 3;
const DEC = 12;

describe('LuxonDateAdapter', () => {
  let adapter: LuxonDateAdapter;
  let assertValidDate: (d: DateTime|null, valid: boolean) => void;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({imports: [LuxonDateModule]}).compileComponents();
  }));

  beforeEach(inject([DateAdapter], (dateAdapter: LuxonDateAdapter) => {
    Settings.defaultLocale = 'en';
    adapter = dateAdapter;
    adapter.setLocale('en');

    assertValidDate = (d: DateTime|null, valid: boolean) => {
      expect(adapter.isDateInstance(d)).not.toBeNull(`Expected ${d} to be a date instance`);
      expect(adapter.isValid(d as DateTime))
          .toBe(
              valid,
              `Expected ${d} to be ${valid ? 'valid' : 'invalid'},` +
                  ` but was ${valid ? 'invalid' : 'valid'}`);
    };
  }));

  it('should get year', () => {
    expect(adapter.getYear(DateTime.local(2017, JAN, 1))).toBe(2017);
  });

  it('should get month', () => {
    expect(adapter.getMonth(DateTime.local(2017, JAN, 1))).toBe(0);
  });

  it('should get date', () => {
    expect(adapter.getDate(DateTime.local(2017, JAN, 1))).toBe(1);
  });

  it('should get day of week', () => {
    expect(adapter.getDayOfWeek(DateTime.local(2017, JAN, 1))).toBe(0);
  });

  it('should get same day of week in a locale with a different first day of the week', () => {
    adapter.setLocale('fr');
    expect(adapter.getDayOfWeek(DateTime.local(2017, JAN, 1))).toBe(0);
  });

  it('should get long month names', () => {
    expect(adapter.getMonthNames('long')).toEqual([
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
      'October', 'November', 'December'
    ]);
  });

  it('should get short month names', () => {
    expect(adapter.getMonthNames('short')).toEqual([
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]);
  });

  it('should get narrow month names', () => {
    expect(adapter.getMonthNames('narrow')).toEqual([
      'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'
    ]);
  });

  it('should get month names in a different locale', () => {
    adapter.setLocale('ja-JP');
    expect(adapter.getMonthNames('long')).toEqual([
      '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'
    ]);
  });

  it('should get date names', () => {
    expect(adapter.getDateNames()).toEqual([
      '1',  '2',  '3',  '4',  '5',  '6',  '7',  '8',  '9',  '10', '11',
      '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22',
      '23', '24', '25', '26', '27', '28', '29', '30', '31'
    ]);
  });

  it('should get date names in a different locale', () => {
    adapter.setLocale('ar-AE');
    expect(adapter.getDateNames()).toEqual([
      '١',  '٢',  '٣',  '٤',  '٥',  '٦',  '٧',  '٨',  '٩',  '١٠', '١١',
      '١٢', '١٣', '١٤', '١٥', '١٦', '١٧', '١٨', '١٩', '٢٠', '٢١', '٢٢',
      '٢٣', '٢٤', '٢٥', '٢٦', '٢٧', '٢٨', '٢٩', '٣٠', '٣١'
    ]);
  });

  it('should get long day of week names', () => {
    expect(adapter.getDayOfWeekNames('long')).toEqual([
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ]);
  });

  it('should get short day of week names', () => {
    expect(adapter.getDayOfWeekNames('short')).toEqual([
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    ]);
  });

  it('should get narrow day of week names', () => {
    expect(adapter.getDayOfWeekNames('narrow')).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
  });

  it('should get day of week names in a different locale', () => {
    adapter.setLocale('ja-JP');
    expect(adapter.getDayOfWeekNames('long')).toEqual([
      '日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'
    ]);
  });

  it('should get year name', () => {
    expect(adapter.getYearName(DateTime.local(2017, JAN, 1))).toBe('2017');
  });

  it('should get year name in a different locale', () => {
    adapter.setLocale('ar-AE');
    expect(adapter.getYearName(DateTime.local(2017, JAN, 1))).toBe('٢٠١٧');
  });

  it('should get first day of week', () => {
    expect(adapter.getFirstDayOfWeek()).toBe(0);
  });

  it('should get first day of week in a different locale', () => {
    adapter.setLocale('fr');
    expect(adapter.getFirstDayOfWeek()).toBe(1);
  });

  it('should create DateTime date', () => {
    expect(adapter.createDate(2017, JAN - 1, 1).toISO())
        .toEqual(DateTime.local(2017, JAN, 1).toISO());
  });

  it('should not create DateTime date with month over/under-flow', () => {
    expect(() => adapter.createDate(2017, DEC + 1, 1)).toThrow();
    expect(() => adapter.createDate(2017, JAN - 2, 1)).toThrow();
  });

  it('should not create DateTime date with date over/under-flow', () => {
    expect(() => adapter.createDate(2017, JAN - 1, 32)).toThrow();
    expect(() => adapter.createDate(2017, JAN - 1, 0)).toThrow();
  });

  it('should create DateTime date with low year number', () => {
    expect(adapter.createDate(-1, JAN - 1, 1).year).toBe(-1);
    expect(adapter.createDate(0, JAN - 1, 1).year).toBe(0);
    expect(adapter.createDate(50, JAN - 1, 1).year).toBe(50);
    expect(adapter.createDate(99, JAN - 1, 1).year).toBe(99);
    expect(adapter.createDate(100, JAN - 1, 1).year).toBe(100);
  });

  it('should not create DateTime date in utc format', () => {
    expect(adapter.createDate(2017, JAN - 1, 5).zone.name).not.toEqual('UTC');
  });

  it('should get today\'s date', () => {
    expect(adapter.sameDate(adapter.today(), DateTime.local()))
        .toBe(true, 'should be equal to today\'s date');
  });

  it('should parse string according to given format', () => {
    expect((adapter.parse('1/2/2017', 'M/d/yyyy') as DateTime).toISO())
        .toEqual(DateTime.local(2017, JAN, 2).toISO());
    expect((adapter.parse('1/2/2017', 'd/M/yyyy') as DateTime).toISO())
        .toEqual(DateTime.local(2017, FEB, 1).toISO());
  });

  it('should parse number', () => {
    const timestamp = new Date().getTime();
    expect((adapter.parse(timestamp, 'MM/dd/yyyy') as DateTime).toISO())
        .toEqual(DateTime.fromMillis(timestamp).toISO());
  });

  it('should parse Date', () => {
    const date = new Date(2017, JAN, 1);
    expect((adapter.parse(date, 'MM/dd/yyyy') as DateTime).toISO())
        .toEqual(DateTime.fromJSDate(date).toISO());
  });

  it('should parse DateTime date', () => {
    const date = DateTime.local(2017, JAN, 1);
    const parsedDate = adapter.parse(date, 'MM/dd/yyyy') as DateTime;
    expect(parsedDate.toISO()).toEqual(date.toISO());
    expect(parsedDate).not.toBe(date);
  });

  it('should parse empty string as null', () => {
    expect(adapter.parse('', 'MM/dd/yyyy')).toBeNull();
  });

  it('should parse invalid value as invalid', () => {
    const d = adapter.parse('hello', 'MM/dd/yyyy');
    expect(d).not.toBeNull();
    expect(adapter.isDateInstance(d))
        .toBe(true, 'Expected string to have been fed through Date.parse');
    expect(adapter.isValid(d as DateTime))
        .toBe(false, 'Expected to parse as "invalid date" object');
  });

  it('should format date according to given format', () => {
    expect(adapter.format(DateTime.local(2017, JAN, 2), 'MM/dd/yyyy')).toEqual('01/02/2017');
    expect(adapter.format(DateTime.local(2017, JAN, 2), 'dd/MM/yyyy')).toEqual('02/01/2017');
  });

  it('should format with a different locale', () => {
    expect(adapter.format(DateTime.local(2017, JAN, 2), 'DD')).toEqual('Jan 2, 2017');
    adapter.setLocale('ja-JP');
    expect(adapter.format(DateTime.local(2017, JAN, 2), 'DD')).toEqual('2017年1月2日');
  });

  it('should throw when attempting to format invalid date', () => {
    expect(() => adapter.format(DateTime.fromMillis(NaN), 'MM/dd/yyyy'))
        .toThrowError(/LuxonDateAdapter: Cannot format invalid date\./);
  });

  it('should add years', () => {
    expect(adapter.addCalendarYears(DateTime.local(2017, JAN, 1), 1).toISO())
        .toEqual(DateTime.local(2018, JAN, 1).toISO());
    expect(adapter.addCalendarYears(DateTime.local(2017, JAN, 1), -1).toISO())
        .toEqual(DateTime.local(2016, JAN, 1).toISO());
  });

  it('should respect leap years when adding years', () => {
    expect(adapter.addCalendarYears(DateTime.local(2016, FEB, 29), 1).toISO())
        .toEqual(DateTime.local(2017, FEB, 28).toISO());
    expect(adapter.addCalendarYears(DateTime.local(2016, FEB, 29), -1).toISO())
        .toEqual(DateTime.local(2015, FEB, 28).toISO());
  });

  it('should add months', () => {
    expect(adapter.addCalendarMonths(DateTime.local(2017, JAN, 1), 1).toISO())
        .toEqual(DateTime.local(2017, FEB, 1).toISO());
    expect(adapter.addCalendarMonths(DateTime.local(2017, JAN, 1), -1).toISO())
        .toEqual(DateTime.local(2016, DEC, 1).toISO());
  });

  it('should respect month length differences when adding months', () => {
    expect(adapter.addCalendarMonths(DateTime.local(2017, JAN, 31), 1).toISO())
        .toEqual(DateTime.local(2017, FEB, 28).toISO());
    expect(adapter.addCalendarMonths(DateTime.local(2017, MAR, 31), -1).toISO())
        .toEqual(DateTime.local(2017, FEB, 28).toISO());
  });

  it('should add days', () => {
    expect(adapter.addCalendarDays(DateTime.local(2017, JAN, 1), 1).toISO())
        .toEqual(DateTime.local(2017, JAN, 2).toISO());
    expect(adapter.addCalendarDays(DateTime.local(2017, JAN, 1), -1).toISO())
        .toEqual(DateTime.local(2016, DEC, 31).toISO());
  });

  it('should clone', () => {
    const date = DateTime.local(2017, JAN, 1);
    expect(adapter.clone(date).toISO()).toEqual(date.toISO());
    expect(adapter.clone(date)).not.toBe(date);
  });

  it('should compare dates', () => {
    expect(adapter.compareDate(DateTime.local(2017, JAN, 1), DateTime.local(2017, JAN, 2)))
        .toBeLessThan(0);
    expect(adapter.compareDate(DateTime.local(2017, JAN, 1), DateTime.local(2017, FEB, 1)))
        .toBeLessThan(0);
    expect(adapter.compareDate(DateTime.local(2017, JAN, 1), DateTime.local(2018, JAN, 1)))
        .toBeLessThan(0);
    expect(adapter.compareDate(DateTime.local(2017, JAN, 1), DateTime.local(2017, JAN, 1))).toBe(0);
    expect(adapter.compareDate(DateTime.local(2018, JAN, 1), DateTime.local(2017, JAN, 1)))
        .toBeGreaterThan(0);
    expect(adapter.compareDate(DateTime.local(2017, FEB, 1), DateTime.local(2017, JAN, 1)))
        .toBeGreaterThan(0);
    expect(adapter.compareDate(DateTime.local(2017, JAN, 2), DateTime.local(2017, JAN, 1)))
        .toBeGreaterThan(0);
  });

  it('should clamp date at lower bound', () => {
    expect(adapter.clampDate(
               DateTime.local(2017, JAN, 1), DateTime.local(2018, JAN, 1),
               DateTime.local(2019, JAN, 1)))
        .toEqual(DateTime.local(2018, JAN, 1));
  });

  it('should clamp date at upper bound', () => {
    expect(adapter.clampDate(
               DateTime.local(2020, JAN, 1), DateTime.local(2018, JAN, 1),
               DateTime.local(2019, JAN, 1)))
        .toEqual(DateTime.local(2019, JAN, 1));
  });

  it('should clamp date already within bounds', () => {
    expect(adapter.clampDate(
               DateTime.local(2018, FEB, 1), DateTime.local(2018, JAN, 1),
               DateTime.local(2019, JAN, 1)))
        .toEqual(DateTime.local(2018, FEB, 1));
  });

  it('should count today as a valid date instance', () => {
    const d = DateTime.local();
    expect(adapter.isValid(d)).toBe(true);
    expect(adapter.isDateInstance(d)).toBe(true);
  });

  it('should count an invalid date as an invalid date instance', () => {
    const d = DateTime.fromMillis(NaN);
    expect(adapter.isValid(d)).toBe(false);
    expect(adapter.isDateInstance(d)).toBe(true);
  });

  it('should count a string as not a date instance', () => {
    const d = '1/1/2017';
    expect(adapter.isDateInstance(d)).toBe(false);
  });

  it('should count a Date as not a date instance', () => {
    const d = new Date();
    expect(adapter.isDateInstance(d)).toBe(false);
  });

  it('should provide a method to return a valid date or null', () => {
    const d = DateTime.local();
    expect(adapter.getValidDateOrNull(d)).toBe(d);
    expect(adapter.getValidDateOrNull(DateTime.fromMillis(NaN))).toBeNull();
  });

  it('should create valid dates from valid ISO strings', () => {
    assertValidDate(adapter.deserialize('1985-04-12T23:20:50.52Z'), true);
    assertValidDate(adapter.deserialize('1996-12-19T16:39:57-08:00'), true);
    assertValidDate(adapter.deserialize('1937-01-01T12:00:27.87+00:20'), true);
    assertValidDate(adapter.deserialize('1990-13-31T23:59:00Z'), false);
    assertValidDate(adapter.deserialize('1/1/2017'), false);
    expect(adapter.deserialize('')).toBeNull();
    expect(adapter.deserialize(null)).toBeNull();
    assertValidDate(adapter.deserialize(new Date()), true);
    assertValidDate(adapter.deserialize(new Date(NaN)), false);
    assertValidDate(adapter.deserialize(DateTime.local()), true);
    assertValidDate(adapter.deserialize(DateTime.invalid('invalid')), false);
  });

  it('should clone the date when deserializing a DateTime date', () => {
    const date = DateTime.local(2017, JAN, 1);
    expect((adapter.deserialize(date) as DateTime).toISO()).toEqual(date.toISO());
    expect(adapter.deserialize(date)).not.toBe(date);
  });

  it('should deserialize dates with the correct locale', () => {
    adapter.setLocale('ja');
    expect((adapter.deserialize('1985-04-12T23:20:50.52Z') as DateTime).locale).toBe('ja');
    expect((adapter.deserialize(new Date()) as DateTime).locale).toBe('ja');
    expect((adapter.deserialize(DateTime.local()) as DateTime).locale).toBe('ja');
  });

  it('setLocale should not modify global DateTime locale', () => {
    expect(Settings.defaultLocale).toBe('en');
    adapter.setLocale('ja-JP');
    expect(Settings.defaultLocale).toBe('en');
  });

  it('returned DateTimes should have correct locale', () => {
    adapter.setLocale('ja-JP');
    expect(adapter.createDate(2017, JAN - 1, 1).locale).toBe('ja');
    expect(adapter.today().locale).toBe('ja');
    expect(adapter.clone(DateTime.local()).locale).toBe('ja');
    expect((adapter.parse('1/1/2017', 'M/d/yyyy') as DateTime).locale).toBe('ja');
    expect(adapter.addCalendarDays(DateTime.local(), 1).locale).toBe('ja');
    expect(adapter.addCalendarMonths(DateTime.local(), 1).locale).toBe('ja');
    expect(adapter.addCalendarYears(DateTime.local(), 1).locale).toBe('ja');
  });

  it('should not change locale of DateTimes passed as params', () => {
    const date = DateTime.local();
    expect(date.locale).toBe('en');
    adapter.setLocale('ja-JP');
    adapter.getYear(date);
    adapter.getMonth(date);
    adapter.getDate(date);
    adapter.getDayOfWeek(date);
    adapter.getYearName(date);
    adapter.getNumDaysInMonth(date);
    adapter.clone(date);
    adapter.parse(date, 'MM/dd/yyyy');
    adapter.format(date, 'MM/dd/yyyy');
    adapter.addCalendarDays(date, 1);
    adapter.addCalendarMonths(date, 1);
    adapter.addCalendarYears(date, 1);
    adapter.toIso8601(date);
    adapter.isDateInstance(date);
    adapter.isValid(date);
    expect(date.locale).toBe('en');
  });

  it('should create invalid date', () => {
    assertValidDate(adapter.invalid(), false);
  });
});

describe('LuxonDateAdapter with MAT_DATE_LOCALE override', () => {
  let adapter: LuxonDateAdapter;

  beforeEach(waitForAsync(() => {
    TestBed
        .configureTestingModule({
          imports: [LuxonDateModule],
          providers: [{provide: MAT_DATE_LOCALE, useValue: 'ja-JP'}]
        })
        .compileComponents();
  }));

  beforeEach(inject([DateAdapter], (d: LuxonDateAdapter) => {
    adapter = d;
  }));

  it('should take the default locale id from the MAT_DATE_LOCALE injection token', () => {
    expect(adapter.format(DateTime.local(2017, JAN, 2), 'DDD')).toEqual('2017年1月2日');
  });
});

describe('LuxonDateAdapter with LOCALE_ID override', () => {
  let adapter: LuxonDateAdapter;

  beforeEach(waitForAsync(() => {
    TestBed
        .configureTestingModule(
            {imports: [LuxonDateModule], providers: [{provide: LOCALE_ID, useValue: 'fr'}]})
        .compileComponents();
  }));

  beforeEach(inject([DateAdapter], (d: LuxonDateAdapter) => {
    adapter = d;
  }));

  it('should take the default locale id from the LOCALE_ID injection token', () => {
    expect(adapter.format(DateTime.local(2017, JAN, 2), 'DD')).toEqual('2 janv. 2017');
  });
});

describe('LuxonDateAdapter with MAT_LUXON_DATE_ADAPTER_OPTIONS override', () => {
  let adapter: LuxonDateAdapter;

  beforeEach(waitForAsync(() => {
    TestBed
        .configureTestingModule({
          imports: [LuxonDateModule],
          providers: [{provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}]
        })
        .compileComponents();
  }));

  beforeEach(inject([DateAdapter], (d: LuxonDateAdapter) => {
    adapter = d;
  }));

  describe('use UTC', () => {
    it('should create DateTime date in UTC', () => {
      expect(adapter.createDate(2017, JAN - 1, 5).zone.name).toBe('UTC');
    });

    it('should create today in UTC', () => {
      expect(adapter.today().zone.name).toBe('UTC');
    });

    it('should parse dates to UTC', () => {
      expect((adapter.parse('1/2/2017', 'M/d/yyyy') as DateTime).zone.name).toBe('UTC');
    });

    it('should return UTC date when deserializing', () => {
      expect((adapter.deserialize('1985-04-12T23:20:50.52Z') as DateTime).zone.name).toBe('UTC');
    });
  });
});
