export function estimateActualCases(ConfirmedCases, Deaths) {
  // TODO: Help needed to estimate :)

  const cSum = (values, cutoff) => {
    return values.slice(0, cutoff).reduce((sum, val) => sum + val, 0);
  };

  const getCFR = t => {
    // C/D
    console.info("CFR @ t=", t, cSum(ConfirmedCases, t) / cSum(Deaths, t));
    return 0.05;
  };
  const AVG_DAYS_TILL_DEATH_FROM_SYMPTOM = 8;

  const getAvgDaysTillDeathFromSymptom = t => {
    return Math.max(0, t - AVG_DAYS_TILL_DEATH_FROM_SYMPTOM);
  };
  // I(1+g_hat)^j

  const calcE = (v, t) => {
    const i_j = getAvgDaysTillDeathFromSymptom(t);
    const est = Deaths[i_j] / getCFR(i_j);
    console.info("Estimate", est, i_j);
    return v > est ? v : est;
  };

  return ConfirmedCases.map((value, index) => calcE(value, index));
}

export default estimateActualCases;
