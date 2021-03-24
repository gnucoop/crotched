# Luxon Date adapter

The Luxon Date adapter allows the [Angular Material Datepicker][ngm-datepicker] component to work with
[Luxon][luxon] DateTime objects.

## How to use

```typescript
import {MatLuxonDateModule} from '@crotched/material-luxon-adapter';

@NgModule({
  imports: [MatDatepickerModule, MatLuxonDateModule]
})
```

By default the `LuxonDateAdapter` creates dates in your time zone specific locale. You can change the default behaviour to parse dates as UTC by providing the MAT_LUXON_DATE_ADAPTER_OPTIONS and setting it to `useUtc: true`.

```typescript
import {MAT_LUXON_DATE_ADAPTER_OPTIONS, MatLuxonDateModule} from '@crotched/material-luxon-adapter';

@NgModule({
  imports: [MatDatepickerModule, MatLuxonDateModule],
  providers: [
    {provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ]
})
```

[luxon]: https://moment.github.io/luxon/
[ngm-datepicker]: https://material.angular.io/components/datepicker
