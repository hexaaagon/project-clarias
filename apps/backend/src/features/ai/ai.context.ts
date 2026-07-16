/**
 * AI Context Builder
 * Converts raw database structures and metrics into compact, human-readable
 * templates to optimize LLM comprehension and response accuracy.
 */
export class AIContextBuilder {
  /**
   * Formats aquaculture metrics into a structured string context.
   */
  static build(params: {
    pondName: string;
    species: string;
    ageDays: number;
    biomassKg: number;
    daysToHarvest: number | string;
    currentWater: {
      temperature: number;
      pH: number;
      dissolvedOxygen: number;
      waterLevelPercent: number;
    } | null;
    feedTodayKg: number;
    weeklyAverageFeedKg: number;
    activeAlerts: string[];
  }): string {
    const currentWaterStr = params.currentWater
      ? `  Temperature: ${params.currentWater.temperature}°C
  pH: ${params.currentWater.pH}
  Dissolved Oxygen: ${params.currentWater.dissolvedOxygen} mg/L
  Water Level: ${params.currentWater.waterLevelPercent}%`
      : "  No water quality readings available.";

    return `Project Clarias
Current Pond:
  Name: ${params.pondName}
  Species: ${params.species}
  Age: ${params.ageDays} days
  Biomass: ${params.biomassKg} kg
  Estimated Harvest: ${params.daysToHarvest} days

Current Water:
${currentWaterStr}

Today's Feeding: ${params.feedTodayKg} kg
Weekly Average: ${params.weeklyAverageFeedKg} kg

Current Alerts: ${params.activeAlerts.length > 0 ? params.activeAlerts.join(", ") : "None"}`;
  }
}
