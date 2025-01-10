// src/utils/periodTracking/index.ts

/****************************************************
 * PERIOD TRACKING & PREDICTION MODEL (TypeScript)
 ****************************************************/

/**
 * You might define interfaces for clarity:
 */
export interface Period {
  start: string; // "YYYY-MM-DD"
  end: string;   // "YYYY-MM-DD"
}

export interface BBTLog {
  date: string;          // "YYYY-MM-DD"
  temperature: number;
}

export interface MucusLog {
  date: string;   // "YYYY-MM-DD"
  score: number;  // 0=Dry up to 4=Egg-white
}

export interface SymptomLog {
  date: string;
  physical?: string[];
  emotional?: string[];
  flow?: string[];
}

export interface LifestyleFactors {
  recentHormonalBCChange?: boolean;
  significantWeightChange?: number;
  highStress?: boolean;
  majorLifestyleChange?: boolean;
  recentIllness?: boolean;
  travelTimeZones?: boolean;
  medicationsAffectingCycle?: boolean;
}

export interface UserData {
  periods: Period[];
  bbtLogs?: BBTLog[];
  mucusLogs?: MucusLog[];
  symptoms?: SymptomLog[];
  lifestyleFactors?: LifestyleFactors;
}

export interface PredictionResult {
  message: string;
  predictions: {
    predictedNextPeriodStart: Date | null;
    predictedNextPeriodEnd: Date | null;
    estimatedOvulationDate: Date | null;
    fertileWindow: { start: Date; end: Date } | null;
    cycleLengthUncertainty: number;
    periodDurationUncertainty: number;
  } | null;
}

/****************************************************
 * HELPER FUNCTIONS
 ****************************************************/

function parseDate(dateString: string): Date {
  // In TS/JS, "YYYY-MM-DD" is typically local time. 
  // If you prefer UTC, you could do: new Date(dateString + "T00:00:00Z")
  return new Date(dateString + "T00:00:00");
}

function dayDifference(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((b.getTime() - a.getTime()) / msPerDay);
}

function average(arr: number[]): number {
  if (!arr || arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return sum / arr.length;
}

function stdDev(arr: number[]): number {
  if (!arr || arr.length < 2) return 0;
  const avg = average(arr);
  const variance =
    arr.map(x => Math.pow(x - avg, 2)).reduce((a, v) => a + v, 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

/****************************************************
 * 1. Compute Cycle Statistics
 ****************************************************/

function computeCycleStatistics(periods: Period[]) {
  if (!periods || periods.length < 2) {
    return {
      avgCycleLength: null,
      stdCycleLength: null,
      avgPeriodDuration: null,
      stdPeriodDuration: null
    };
  }

  const cycleLengths: number[] = [];
  const periodDurations: number[] = [];

  for (let i = 0; i < periods.length; i++) {
    const startDate = parseDate(periods[i].start);
    const endDate = parseDate(periods[i].end);

    const duration = dayDifference(startDate, endDate) + 1;
    periodDurations.push(duration);

    if (i < periods.length - 1) {
      const nextStart = parseDate(periods[i + 1].start);
      const cLen = dayDifference(startDate, nextStart);
      cycleLengths.push(cLen);
    }
  }

  return {
    avgCycleLength: average(cycleLengths),
    stdCycleLength: stdDev(cycleLengths),
    avgPeriodDuration: average(periodDurations),
    stdPeriodDuration: stdDev(periodDurations)
  };
}

/****************************************************
 * 2. Ovulation Estimation
 ****************************************************/

function estimateOvulation(
  bbtLogs: BBTLog[] | undefined,
  mucusLogs: MucusLog[] | undefined,
  predictedPeriodStart: Date,
  lutealPhase = 14
): Date | null {
  const hasBBT = bbtLogs && bbtLogs.length > 0;
  const hasMucus = mucusLogs && mucusLogs.length > 0;

  if (!hasBBT && !hasMucus) {
    // fallback
    const fallback = new Date(predictedPeriodStart);
    fallback.setDate(fallback.getDate() - lutealPhase);
    return fallback;
  }

  let ovulationBBT: Date | null = null;
  if (hasBBT) {
    bbtLogs!.sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
    if (bbtLogs!.length > 6) {
      for (let i = 6; i < bbtLogs!.length; i++) {
        const prevTemps = bbtLogs!.slice(i - 6, i).map(log => log.temperature);
        const avgPrev6 = average(prevTemps);
        const currentT = bbtLogs![i].temperature;
        if (currentT - avgPrev6 >= 0.2) {
          const dateFound = parseDate(bbtLogs![i].date);
          dateFound.setDate(dateFound.getDate() - 1);
          ovulationBBT = dateFound;
          break;
        }
      }
    }
  }

  let ovulationMucus: Date | null = null;
  if (hasMucus) {
    mucusLogs!.sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
    const highScore = mucusLogs!.filter(m => m.score >= 3);
    if (highScore.length > 0) {
      const lastPeak = parseDate(highScore[highScore.length - 1].date);
      ovulationMucus = lastPeak;
    }
  }

  let combined = ovulationBBT || ovulationMucus;
  if (ovulationBBT && ovulationMucus) {
    const diff = dayDifference(ovulationBBT, ovulationMucus);
    if (Math.abs(diff) <= 2) {
      const midTime = (ovulationBBT.getTime() + ovulationMucus.getTime()) / 2;
      combined = new Date(midTime);
    } else {
      combined = ovulationBBT;
    }
  }

  if (!combined) {
    const fallback = new Date(predictedPeriodStart);
    fallback.setDate(fallback.getDate() - lutealPhase);
    return fallback;
  }

  return combined;
}

/****************************************************
 * 3. Lifestyle Adjustments
 ****************************************************/

function applyLifestyleAdjustments(lifestyle: LifestyleFactors | undefined, baseCycle: number): number {
  if (!lifestyle) return baseCycle;

  let adjusted = baseCycle;

  if (lifestyle.recentHormonalBCChange) {
    adjusted += 3;
  }
  if (lifestyle.significantWeightChange) {
    const shift = Math.min(5, Math.floor(Math.abs(lifestyle.significantWeightChange) / 2));
    adjusted += shift;
  }
  if (lifestyle.highStress) {
    adjusted += 2;
  }
  if (lifestyle.majorLifestyleChange) {
    adjusted += 2;
  }
  if (lifestyle.recentIllness) {
    adjusted += 1;
  }
  if (lifestyle.travelTimeZones) {
    adjusted += 1;
  }
  if (lifestyle.medicationsAffectingCycle) {
    adjusted += 2;
  }

  return adjusted;
}

/****************************************************
 * 4. Symptom-Based Adjustments
 ****************************************************/

const OVULATORY_SYMPTOMS = new Set(["Cramps", "Spotting", "IncreasedSexDrive"]);

function applySymptomAdjustments(
  symptoms: SymptomLog[] | undefined,
  nextPeriodStart: Date,
  ovulationDate: Date | null
): [Date, Date | null] {
  if (!symptoms) {
    return [nextPeriodStart, ovulationDate];
  }

  // create date-based map
  type SymptomMap = Record<string, { physical: string[]; emotional: string[]; flow: string[] }>;
  const symptomMap: SymptomMap = {};

  for (const entry of symptoms) {
    if (!entry.date) continue;
    const d = parseDate(entry.date).toISOString(); // ISO key for the map
    if (!symptomMap[d]) {
      symptomMap[d] = { physical: [], emotional: [], flow: [] };
    }
    if (entry.physical) {
      symptomMap[d].physical.push(...entry.physical);
    }
    if (entry.emotional) {
      symptomMap[d].emotional.push(...entry.emotional);
    }
    if (entry.flow) {
      symptomMap[d].flow.push(...entry.flow);
    }
  }

  // 1) Adjust next period start if we see medium/heavy flow earlier
  let adjustedPeriod = new Date(nextPeriodStart);
  for (let offset = -3; offset <= 3; offset++) {
    const checkDate = new Date(nextPeriodStart);
    checkDate.setDate(checkDate.getDate() + offset);
    const key = checkDate.toISOString();
    if (symptomMap[key]) {
      const flows = symptomMap[key].flow;
      if (flows.some(f => f === "Medium" || f === "Heavy") && offset < 0) {
        adjustedPeriod = checkDate;
        break;
      }
    }
  }

  // 2) Adjust ovulation if we see typical ovulatory signs
  let adjustedOvulation = ovulationDate ? new Date(ovulationDate) : null;
  if (adjustedOvulation) {
    for (let offset = -2; offset <= 2; offset++) {
      const checkDate = new Date(adjustedOvulation);
      checkDate.setDate(checkDate.getDate() + offset);
      const key = checkDate.toISOString();
      if (symptomMap[key]) {
        const pSet = new Set(symptomMap[key].physical);
        const fSet = new Set(symptomMap[key].flow);
        if ([...pSet].some(s => OVULATORY_SYMPTOMS.has(s)) || fSet.has("Spotting")) {
          adjustedOvulation = checkDate;
          break;
        }
      }
    }
  }

  return [adjustedPeriod, adjustedOvulation];
}

/****************************************************
 * 5. MAIN FUNCTION: getCyclePredictions
 ****************************************************/

export function getCyclePredictions(userData: UserData): PredictionResult {
  const periods = userData.periods || [];
  if (periods.length === 0) {
    return {
      message: "No period data provided. Cannot compute predictions.",
      predictions: null
    };
  }

  // 1. Stats
  const { 
    avgCycleLength, 
    stdCycleLength, 
    avgPeriodDuration, 
    stdPeriodDuration 
  } = computeCycleStatistics(periods);

  if (!avgCycleLength) {
    return {
      message: "Insufficient period history to compute cycle statistics.",
      predictions: null
    };
  }

  // 2. Identify last period start
  const lastPeriod = periods[periods.length - 1];
  const lastStart = parseDate(lastPeriod.start);

  // 3. Adjust cycle length by lifestyle
  const adjustedCycleLength = applyLifestyleAdjustments(userData.lifestyleFactors, avgCycleLength);

  // 4. Predict next period start
  const predictedNextPeriodStart = new Date(lastStart);
  predictedNextPeriodStart.setDate(predictedNextPeriodStart.getDate() + Math.round(adjustedCycleLength));

  // 5. Estimate ovulation
  const bbtLogs = userData.bbtLogs || [];
  const mucusLogs = userData.mucusLogs || [];
  let estimatedOvulation = estimateOvulation(bbtLogs, mucusLogs, predictedNextPeriodStart, 14);

  // 6. Symptom-based adjustments
  const [finalPeriodStart, finalOvulation] = applySymptomAdjustments(
    userData.symptoms,
    predictedNextPeriodStart,
    estimatedOvulation
  );

  // 7. Fertile window
  let fertileWindow: { start: Date; end: Date } | null = null;
  if (finalOvulation) {
    const startFertile = new Date(finalOvulation);
    startFertile.setDate(startFertile.getDate() - 5);

    const endFertile = new Date(finalOvulation);
    endFertile.setDate(endFertile.getDate() + 1);

    fertileWindow = { start: startFertile, end: endFertile };
  }

  // 8. Next period end
  const defaultDays = 5;
  const periodDur = avgPeriodDuration || defaultDays;
  const predictedNextPeriodEnd = new Date(finalPeriodStart);
  predictedNextPeriodEnd.setDate(predictedNextPeriodEnd.getDate() + Math.round(periodDur) - 1);

  // 9. Construct result
  return {
    message: "Predictions computed successfully (TypeScript version).",
    predictions: {
      predictedNextPeriodStart: finalPeriodStart,
      predictedNextPeriodEnd,
      estimatedOvulationDate: finalOvulation,
      fertileWindow,
      cycleLengthUncertainty: stdCycleLength || 0,
      periodDurationUncertainty: stdPeriodDuration || 0
    }
  };
}
