
// List of inactive professionals who should not appear in rankings

export const INACTIVE_PROFESSIONALS = ["Andressa", "Andrei", "Paula", "Karol", "Lulu", "Lucas", "Luana", "Najla", "Claudia", "Angi", "Débora", "Diane", "Betina", "Cardoso"];

/**
 * - Está na lista INACTIVE_PROFESSIONALS
 * - OU começa com "Inativo:"
 * - OU começa com "ID:"
 */
export function isInactiveProfessional(professional: string): boolean {
  if (!professional) return true; // defensivo: string vazia ou undefined já é tratado como inativo
  return (
    INACTIVE_PROFESSIONALS.includes(professional) ||
    professional.startsWith("Inativo:") ||
    professional.startsWith("ID:")
  );
}
