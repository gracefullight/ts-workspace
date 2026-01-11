---
"@gracefullight/saju": major
---

Move adapter from first argument to options object

BREAKING CHANGE: All public API functions now take datetime as the first argument and adapter as part of the options object.

Before: `getSaju(adapter, datetime, options)`
After: `getSaju(datetime, { adapter, ...options })`

Affected functions:
- getSaju, getFourPillars
- yearPillar, monthPillar, hourPillar, effectiveDayDate
- analyzeSolarTerms, getSolarTermsForYear
- calculateMajorLuck
