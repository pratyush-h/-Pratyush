import type { 
  CycloneTelemetry, 
  RiskAssessment, 
  CycloneCategory, 
  AlertLevel, 
  CoastalAlert 
} from '../types/cyclone';

export const HISTORICAL_PRESETS: CycloneTelemetry[] = [
  {
    id: 'live-active-telemetry',
    systemName: 'Bay of Bengal Tropical Storm AI Telemetry',
    latitude: 18.4,
    longitude: 87.2,
    distanceToCoastKm: 185,
    centralPressureHpa: 955,
    maxWindSpeedKmph: 145,
    gustWindSpeedKmph: 175,
    seaSurfaceTempC: 30.2,
    movementSpeedKmph: 16,
    movementHeading: 'NW towards Paradip & Dhamra Port',
    cloudDensityIndexPct: 92,
    forecastLandfallPoint: 'Paradip - Dhamra Coast (Odisha)',
    forecastLandfallCoords: [20.45, 86.85],
    estimatedLandfallTime: 'Within 14 Hours (Today, 23:30 IST)',
    surgeHeightMeters: 3.8,
  },
  {
    id: 'cyclone-dana-2024',
    systemName: 'Severe Cyclone DANA (2024 Archive)',
    latitude: 20.6,
    longitude: 87.1,
    distanceToCoastKm: 45,
    centralPressureHpa: 980,
    maxWindSpeedKmph: 120,
    gustWindSpeedKmph: 135,
    seaSurfaceTempC: 29.0,
    movementSpeedKmph: 14,
    movementHeading: 'NNW towards Bhadrak-Kendrapara Coast',
    cloudDensityIndexPct: 86,
    forecastLandfallPoint: 'Dhamra & Habalikhati Nature Camp',
    forecastLandfallCoords: [20.79, 86.91],
    estimatedLandfallTime: 'Historical Impact (25 Oct 2024)',
    surgeHeightMeters: 2.2,
    historicalReference: 'Successfully mitigated by OSDMA 10-Lakh person evacuation',
  },
  {
    id: 'cyclone-fani-2019',
    systemName: 'Extremely Severe Cyclone FANI (2019 Archive)',
    latitude: 19.7,
    longitude: 85.8,
    distanceToCoastKm: 15,
    centralPressureHpa: 932,
    maxWindSpeedKmph: 215,
    gustWindSpeedKmph: 250,
    seaSurfaceTempC: 31.0,
    movementSpeedKmph: 18,
    movementHeading: 'NNE directly into Puri Coast',
    cloudDensityIndexPct: 98,
    forecastLandfallPoint: 'Puri City & Chilika Lagoon',
    forecastLandfallCoords: [19.80, 85.82],
    estimatedLandfallTime: 'Historical Impact (03 May 2019)',
    surgeHeightMeters: 5.5,
    historicalReference: 'IMD Signal No. 10. UN praised OSDMA evacuation speed.',
  },
  {
    id: 'super-cyclone-1999',
    systemName: 'Odisha Super Cyclone (1999 Historical Benchmark)',
    latitude: 20.15,
    longitude: 86.5,
    distanceToCoastKm: 5,
    centralPressureHpa: 912,
    maxWindSpeedKmph: 260,
    gustWindSpeedKmph: 300,
    seaSurfaceTempC: 30.8,
    movementSpeedKmph: 12,
    movementHeading: 'NW directly into Ersama, Jagatsinghpur',
    cloudDensityIndexPct: 100,
    forecastLandfallPoint: 'Ersama / Paradip Coast',
    forecastLandfallCoords: [20.15, 86.43],
    estimatedLandfallTime: 'Historical Benchmark (29 Oct 1999)',
    surgeHeightMeters: 7.2,
    historicalReference: 'Catalyst for founding OSDMA & ODRAF elite forces.',
  },
];

/**
 * AI Classifier: Classifies storm based on IMD wind thresholds
 */
export function classifyCycloneCategory(windSpeedKmph: number): { category: CycloneCategory; categoryOdia: string; signalNo: number } {
  if (windSpeedKmph >= 221) {
    return { category: 'Super Cyclone', categoryOdia: 'ମହାବାତ୍ୟା (Super Cyclone)', signalNo: 10 };
  } else if (windSpeedKmph >= 166) {
    return { category: 'Extremely Severe Cyclonic Storm', categoryOdia: 'ଅତି ଭୟଙ୍କର ବାତ୍ୟା (Extremely Severe CS)', signalNo: 10 };
  } else if (windSpeedKmph >= 118) {
    return { category: 'Very Severe Cyclonic Storm', categoryOdia: 'ଖୁବ୍ ଭୟଙ୍କର ବାତ୍ୟା (Very Severe CS)', signalNo: 9 };
  } else if (windSpeedKmph >= 89) {
    return { category: 'Severe Cyclonic Storm', categoryOdia: 'ଭୟଙ୍କର ବାତ୍ୟା (Severe CS)', signalNo: 7 };
  } else if (windSpeedKmph >= 62) {
    return { category: 'Cyclonic Storm', categoryOdia: 'ବାତ୍ୟା (Cyclonic Storm)', signalNo: 4 };
  } else if (windSpeedKmph >= 50) {
    return { category: 'Deep Depression', categoryOdia: 'ଗଭୀର ଅବପାତ (Deep Depression)', signalNo: 3 };
  } else if (windSpeedKmph >= 31) {
    return { category: 'Depression', categoryOdia: 'ଅବପାତ (Depression)', signalNo: 1 };
  } else {
    return { category: 'Low Pressure Area', categoryOdia: 'ଲଘୁଚାପ (Low Pressure)', signalNo: 0 };
  }
}

/**
 * AI Risk Model Engine: Computes risk score %, storm surge, alert level, and district breakdowns
 */
export function evaluateCycloneRisk(telemetry: CycloneTelemetry): RiskAssessment {
  const { category, categoryOdia, signalNo } = classifyCycloneCategory(telemetry.maxWindSpeedKmph);

  // Pressure score contribution (Standard sea level = 1013.25 hPa)
  const pressureDelta = Math.max(0, 1013 - telemetry.centralPressureHpa);
  const pressureFactor = (pressureDelta / 70) * 40;

  // Wind speed contribution (Max calibrated to 260 km/h)
  const windFactor = (Math.min(260, telemetry.maxWindSpeedKmph) / 260) * 45;

  // Proximity to coast factor (Max impact within 300km)
  const proximityFactor = Math.max(0, (400 - telemetry.distanceToCoastKm) / 400) * 15;

  const rawScore = pressureFactor + windFactor + proximityFactor;
  const riskScorePct = Math.min(100, Math.max(5, Math.round(rawScore)));

  let level: AlertLevel = 'GREEN';
  let summaryTitle = 'Normal Atmospheric Monitoring';
  let summaryTitleOdia = 'ସାଧାରଣ ବାୟୁମଣ୍ଡଳୀୟ ନିରୀକ୍ଷଣ';
  let isEvacuationMandatory = false;

  if (riskScorePct >= 75) {
    level = 'RED';
    summaryTitle = `RED ALERT: HIGH SEVERE ${category.toUpperCase()} THREAT TO ODISHA COAST`;
    summaryTitleOdia = `ଲାଲ ସତର୍କତା: ଓଡ଼ିଶା ଉପକୂଳ ପ୍ରତି ${categoryOdia} ର ପ୍ରତ୍ୟକ୍ଷ ବିପଦ`;
    isEvacuationMandatory = true;
  } else if (riskScorePct >= 50) {
    level = 'ORANGE';
    summaryTitle = `ORANGE ALERT: ${category} APPROACHING ODISHA COASTLINE`;
    summaryTitleOdia = `କମଳା ସତର୍କତା: ଓଡ଼ିଶା ଉପକୂଳ ନିକଟତର ହେଉଛି ${categoryOdia}`;
    isEvacuationMandatory = telemetry.distanceToCoastKm < 100;
  } else if (riskScorePct >= 30) {
    level = 'YELLOW';
    summaryTitle = `YELLOW ALERT: CYCLONIC CIRCULATION ACTIVE IN BAY OF BENGAL`;
    summaryTitleOdia = `ହଳଦିଆ ସତର୍କତା: ବଙ୍ଗୋପସାଗରରେ ସକ୍ରିୟ ବାତ୍ୟା ବଳୟ`;
  }

  // Calculate Surge Warning
  const surgeWarningMeters = Math.max(0.5, Number((telemetry.surgeHeightMeters || (telemetry.maxWindSpeedKmph * 0.03)).toFixed(1)));

  // District-wise Coastal Impact Breakdown
  const coastalDistricts = [
    { district: 'Puri', districtOdia: 'ପୁରୀ', distanceKm: Math.round(telemetry.distanceToCoastKm * 0.9) },
    { district: 'Jagatsinghpur', districtOdia: 'ଜଗତସିଂହପୁର (Paradip)', distanceKm: Math.round(telemetry.distanceToCoastKm * 0.8) },
    { district: 'Kendrapara', districtOdia: 'କେନ୍ଦ୍ରାପଡ଼ା (Rajnagar)', distanceKm: Math.round(telemetry.distanceToCoastKm * 0.85) },
    { district: 'Bhadrak', districtOdia: 'ଭଦ୍ରକ (Dhamra)', distanceKm: Math.round(telemetry.distanceToCoastKm * 1.0) },
    { district: 'Balasore', districtOdia: 'ବାଲେଶ୍ୱର (Chandipur)', distanceKm: Math.round(telemetry.distanceToCoastKm * 1.15) },
    { district: 'Ganjam', districtOdia: 'ଗଞ୍ଜାମ (Gopalpur)', distanceKm: Math.round(telemetry.distanceToCoastKm * 1.25) },
    { district: 'Khordha', districtOdia: 'ଖୋର୍ଦ୍ଧା (Bhubaneswar)', distanceKm: Math.round(telemetry.distanceToCoastKm * 1.1) },
  ];

  const coastalAlerts: CoastalAlert[] = coastalDistricts.map((d) => {
    let dLevel: AlertLevel = 'GREEN';
    let evac: CoastalAlert['evacuationStatus'] = 'Safe';

    if (level === 'RED' && d.distanceKm < 200) {
      dLevel = 'RED';
      evac = 'Evacuation Required';
    } else if (level === 'RED' || (level === 'ORANGE' && d.distanceKm < 250)) {
      dLevel = 'ORANGE';
      evac = 'High Vigilance';
    } else if (level === 'ORANGE' || level === 'YELLOW') {
      dLevel = 'YELLOW';
      evac = 'Standby';
    }

    const expectedWind = Math.round(telemetry.maxWindSpeedKmph * Math.max(0.4, 1 - d.distanceKm / 600));

    return {
      district: d.district,
      districtOdia: d.districtOdia,
      riskLevel: dLevel,
      distanceToStormKm: d.distanceKm,
      expectedWindSpeedKmph: expectedWind,
      stormSurgeMeters: Number((surgeWarningMeters * (dLevel === 'RED' ? 1.0 : 0.6)).toFixed(1)),
      evacuationStatus: evac,
    };
  });

  const immediateDirectives: string[] = [];
  if (isEvacuationMandatory) {
    immediateDirectives.push('Mandatory coastal evacuation active within 5 km of shoreline & kutcha houses.');
    immediateDirectives.push('ODRAF & NDRF rescue teams dispatched to Puri, Paradip, Dhamra, and Kendrapara shelters.');
    immediateDirectives.push(`IMD Signal No. ${signalNo} hoisted at Paradip, Gopalpur, and Dhamra ports. Total fishing ban in effect.`);
    immediateDirectives.push('Power grid controlled shutdown in high-wind landfall corridors.');
  } else if (level === 'ORANGE') {
    immediateDirectives.push('Port warning signals raised. Fishermen advised not to venture into deep sea.');
    immediateDirectives.push('OSDMA shelters unlocked; food, drinking water, and backup generators verified.');
    immediateDirectives.push('District emergency control rooms operating on 24x7 emergency shift.');
  } else {
    immediateDirectives.push('Continuous satellite radar tracking on Bay of Bengal depression.');
    immediateDirectives.push('Coastal district collectors instructed to maintain disaster preparedness check.');
  }

  return {
    level,
    riskScorePct,
    category,
    categoryOdia,
    imdSignalNumber: signalNo,
    summaryTitle,
    summaryTitleOdia,
    immediateDirectives,
    coastalAlerts,
    surgeWarningMeters,
    isEvacuationMandatory,
  };
}

/**
 * Fetch real-time live weather for Odisha coast (Paradip / Puri) via Open-Meteo as fallback API
 */
export async function fetchLiveOdishaCoastWeather(): Promise<{ temp: number; windSpeed: number; pressure: number }> {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=19.80&longitude=85.82&current=temperature_2m,wind_speed_10m,surface_pressure');
    if (!res.ok) throw new Error('API response not ok');
    const data = await res.json();
    return {
      temp: data.current.temperature_2m || 28.5,
      windSpeed: data.current.wind_speed_10m || 24,
      pressure: data.current.surface_pressure || 1008,
    };
  } catch (err) {
    console.warn('Fallback to simulated live weather stream:', err);
    return { temp: 29.2, windSpeed: 32, pressure: 1004 };
  }
}
