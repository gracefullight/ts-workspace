# saju

[English](./README.md) | **한국어**

[![pub version](https://img.shields.io/pub/v/saju.svg)](https://pub.dev/packages/saju)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

사주명리(四柱命理)를 계산하고 포괄적으로 분석하는 Dart/Flutter 라이브러리입니다.

## 기능

- **사주팔자 계산** - 천문 알고리즘을 사용한 정확한 계산
- **십신 분석** - 지장간을 포함한 완전한 십신(十神) 분석
- **신강신약 평가** - 9단계 신강신약 분석
- **관계 분석** - 합충형파해(合沖刑破害) 관계 분석
- **십이운성** - 십이운성 분석
- **용신 추출** - 격국→억부→조후 우선순위에 따른 용신 추천
- **절기** - 정밀한 24절기 계산
- **대운/세운** - 대운, 세운, 월운, 일운 계산
- **음력** - 양력/음력 변환

## 설치

```yaml
dependencies:
  saju: ^0.1.0
```

## 빠른 시작

```dart
import 'package:saju/saju.dart';
import 'package:timezone/data/latest.dart' as tzdata;
import 'package:timezone/timezone.dart' as tz;

void main() {
  // 타임존 데이터 초기화
  tzdata.initializeTimeZones();

  // 타임존을 포함한 생년월일시 생성
  final location = tz.getLocation('Asia/Seoul');
  final birthDateTime = tz.TZDateTime(location, 2000, 1, 1, 18, 0);

  // 사주 분석 계산
  final result = getSaju(
    birthDateTime,
    gender: Gender.male,
  );

  // 결과 접근
  print('사주팔자: ${result.pillars.toMap()}');
  print('일간: ${result.pillars.dayMaster.hanja}');
  print('신강신약: ${result.strength.level.korean}');
  print('용신: ${result.yongShen.primary.korean}');
}
```

## 사용법

### 사주팔자만 계산

```dart
final location = tz.getLocation('Asia/Seoul');
final dt = tz.TZDateTime(location, 2000, 1, 1, 18, 0);

final result = getFourPillars(dt);

print(result.pillars.year.hanja);  // 己卯
print(result.pillars.month.hanja); // 丙子
print(result.pillars.day.hanja);   // 辛巳
print(result.pillars.hour.hanja);  // 戊戌
```

### 십신 분석

```dart
final pillars = FourPillars(
  year: Pillar.fromHanja('己卯'),
  month: Pillar.fromHanja('丙子'),
  day: Pillar.fromHanja('辛巳'),
  hour: Pillar.fromHanja('戊戌'),
);

final tenGods = analyzeTenGods(pillars);
print('일간: ${tenGods.dayMaster.hanja}');
print('연간 십신: ${tenGods.year.stem.tenGod.korean}');
```

### 신강신약 평가

```dart
final strength = analyzeStrength(pillars);
print('레벨: ${strength.level.korean}');  // 예: 신약, 신강
print('점수: ${strength.score}');
print('요소: ${strength.factors.deukryeong}');
```

### 관계 분석

```dart
final relations = analyzeRelations(pillars);

// 합
for (final combo in relations.sixCombinations) {
  print('${combo.pair[0].hanja}-${combo.pair[1].hanja} -> ${combo.resultElement.korean}');
}

// 충
for (final clash in relations.clashes) {
  print('충: ${clash.pair[0].hanja}-${clash.pair[1].hanja}');
}
```

### 용신 추출

```dart
final yongShen = analyzeYongShen(pillars);
print('주용신: ${yongShen.primary.korean}');
print('방법: ${yongShen.method.korean}');
print('근거: ${yongShen.reasoning}');

// 추천 받기
final recommendations = getElementRecommendations(yongShen);
print('행운의 색: ${recommendations.colors}');
print('행운의 방향: ${recommendations.directions}');
print('행운의 숫자: ${recommendations.numbers}');
```

### 운세 계산

```dart
// 대운
print('대운 시작 나이: ${result.majorLuck.startAge}');
for (final pillar in result.majorLuck.pillars) {
  print('${pillar.startAge}-${pillar.endAge}세: ${pillar.pillar.hanja}');
}

// 세운
final yearlyLuck = calculateYearlyLuck(1999, 2024, 2030);
for (final luck in yearlyLuck) {
  print('${luck.year}년 (${luck.age}세): ${luck.pillar.hanja}');
}
```

### 설정 프리셋

```dart
// 표준 프리셋 (기본값): 자정 기준
final standard = getFourPillars(dt, preset: standardPreset);

// 전통 프리셋: 자시(23:00) 기준 및 태양시 적용
final traditional = getFourPillars(dt, preset: traditionalPreset);
```

## API 참조

### 핵심 함수

| 함수 | 설명 |
|----------|-------------|
| `getSaju()` | 전체 사주 분석 |
| `getFourPillars()` | 사주팔자 계산 |
| `yearPillar()` | 연주(Year pillar)만 계산 |
| `monthPillar()` | 월주(Month pillar)만 계산 |
| `dayPillarFromDate()` | 일주(Day pillar)만 계산 |
| `hourPillar()` | 시주(Hour pillar)만 계산 |
| `analyzeTenGods()` | 십신 분석 |
| `analyzeStrength()` | 신강신약 평가 |
| `analyzeRelations()` | 관계 분석 |
| `analyzeTwelveStages()` | 십이운성 분석 |
| `analyzeYongShen()` | 용신 추출 |
| `analyzeSolarTerms()` | 24절기 정보 |
| `calculateMajorLuck()` | 대운 계산 |
| `calculateYearlyLuck()` | 세운 계산 |
| `calculateMonthlyLuck()` | 월운 계산 |
| `calculateDailyLuck()` | 일운 계산 |
| `getLunarDate()` | 음력 변환 |

### 열거형 (Enums)

- `Stem` - 10 천간 (Ten Heavenly Stems)
- `Branch` - 12 지지 (Twelve Earthly Branches)
- `Element` - 오행 (Five Elements)
- `Polarity` - 음양 (Yin/Yang)
- `Gender` - 남/여 (Male/Female)
- `TenGod` - 십신 (Ten Gods)
- `StrengthLevel` - 9단계 신강신약
- `TwelveStage` - 십이운성 (Twelve Life Stages)
- `SolarTerm` - 24절기 (Solar Terms)

## 의존성

- [timezone](https://pub.dev/packages/timezone) - IANA 타임존 데이터베이스
- [jiffy](https://pub.dev/packages/jiffy) - 날짜 조작
- [lunar](https://pub.dev/packages/lunar) - 음력 변환

## 관련 프로젝트

- 타입스크립트 버전: [@gracefullight/saju](https://www.npmjs.com/package/@gracefullight/saju)

## 라이선스

MIT © [gracefullight](https://github.com/gracefullight)
