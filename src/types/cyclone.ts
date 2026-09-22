export type HelplineCategory = 'rescue' | 'state' | 'national' | 'district' | 'medical' | 'coastal';

export interface HelplineContact {
  id: string;
  name: string;
  nameOdia?: string;
  organization: string;
  category: HelplineCategory;
  primaryPhone: string;
  secondaryPhone?: string;
  tollFree?: string;
  district?: string;
  description: string;
  is24x7: boolean;
  priority: number; // 1 = highest / emergency
  iconName: string;
}

export interface PersonalContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  altPhone?: string;
  district: string;
  notes?: string;
  isPrimarySOS: boolean;
}

export type CycloneCategory = 
  | 'Low Pressure Area'
  | 'Well Marked Low Pressure'
  | 'Depression'
  | 'Deep Depression'
  | 'Cyclonic Storm'
  | 'Severe Cyclonic Storm'
  | 'Very Severe Cyclonic Storm'
  | 'Extremely Severe Cyclonic Storm'
  | 'Super Cyclone';

export type AlertLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

export interface CoastalAlert {
  district: string;
  districtOdia: string;
  riskLevel: AlertLevel;
  distanceToStormKm: number;
  expectedWindSpeedKmph: number;
  stormSurgeMeters: number;
  evacuationStatus: 'Evacuation Required' | 'High Vigilance' | 'Standby' | 'Safe';
}

export interface CycloneTelemetry {
  id: string;
  systemName: string; // e.g. "Cyclone DANA / Active Bay Storm"
  latitude: number;
  longitude: number;
  distanceToCoastKm: number;
  centralPressureHpa: number; // e.g. 960 hPa
  maxWindSpeedKmph: number; // e.g. 135 km/h
  gustWindSpeedKmph: number;
  seaSurfaceTempC: number; // e.g. 29.5 C
  movementSpeedKmph: number; // e.g. 15 km/h
  movementHeading: string; // e.g. "NW towards Puri-Paradip"
  cloudDensityIndexPct: number; // e.g. 88%
  forecastLandfallPoint: string;
  forecastLandfallCoords: [number, number];
  estimatedLandfallTime: string;
  surgeHeightMeters: number;
  historicalReference?: string;
}

export interface RiskAssessment {
  level: AlertLevel;
  riskScorePct: number; // 0 - 100
  category: CycloneCategory;
  categoryOdia: string;
  imdSignalNumber: number; // e.g., Signal No. 10 (Great Danger)
  summaryTitle: string;
  summaryTitleOdia: string;
  immediateDirectives: string[];
  coastalAlerts: CoastalAlert[];
  surgeWarningMeters: number;
  isEvacuationMandatory: boolean;
}

export interface EvacuationShelter {
  id: string;
  name: string;
  nameOdia: string;
  district: string;
  block: string;
  latitude: number;
  longitude: number;
  capacityPersons: number;
  currentOccupants: number;
  contactPerson: string;
  contactPhone: string;
  hasGenerator: boolean;
  hasDrinkingWater: boolean;
  hasMedicalKit: boolean;
  status: 'Open' | 'Standby' | 'Full';
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  textOdia?: string;
  timestamp: string;
  emergencyType?: 'shelter' | 'safety' | 'helpline' | 'sos' | 'general';
}
