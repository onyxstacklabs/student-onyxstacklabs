import { EVScooterTelemetry } from '@/types/mobility';

export interface BatteryStatusAlert {
  level: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
}

export function calculateTimeToFullMinutes(currentPercent: number): number {
  if (currentPercent >= 100) return 0;
  const remainingPercent = 100 - currentPercent;
  // Standard campus charger rate: ~1.2 minutes per 1% charge
  return Math.round(remainingPercent * 1.2);
}

export function evaluateBatteryAlerts(telemetry: EVScooterTelemetry): BatteryStatusAlert | null {
  if (telemetry.batteryLevelPercent <= 15) {
    return {
      level: 'critical',
      title: 'Critical Battery Level',
      message: 'Battery below 15%. Recharge immediately at nearest solar dock to avoid lockout.',
    };
  }

  if (telemetry.batteryLevelPercent <= 30) {
    return {
      level: 'warning',
      title: 'Low Battery Advisory',
      message: 'Battery below 30%. Consider planning a stop at a campus EV charging hub.',
    };
  }

  if (telemetry.healthPercent < 80) {
    return {
      level: 'warning',
      title: 'Battery Health Degradation',
      message: 'Battery health is under 80%. Schedule unit inspection with campus fleet management.',
    };
  }

  return null;
}
