export const LAB_ASSISTANT_CONTROL_EVENT = "lab-assistant-control";

export interface LabAssistantControlDetail {
  labId: string;
  action: Record<string, unknown>;
  at: number;
}

export function isCollisionLabId(labId: string) {
  return labId === "collision" || labId === "laws-of-collisions";
}
