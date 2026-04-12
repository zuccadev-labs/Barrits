import { logic } from "../logic";
import { routes } from "../routes";
import { traits } from "../traits";

/**
 * Primary Barrits domain namespace exported to consumers.
 */
export const barrits = {
  logic,
  routes,
  traits,
};

/**
 * Short alias of the Barrits domain namespace.
 */
export const brt = barrits;