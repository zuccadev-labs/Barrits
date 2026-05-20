/**
 * [EN] Implementation of Truncate.
 * [ES] Implementación de Truncate.
 */
export const truncate = (input: string, maxLength: number, ellipsis = '…'): string => {
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength - ellipsis.length).trimEnd() + ellipsis;
};
