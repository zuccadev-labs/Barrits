import { logic } from "../logic";
import { routes } from "../routes";
import { traits } from "../traits";

/**
 * [EN] Primary Barrits domain namespace exported to consumers.
 * Features a fractal orchestration structure containing logic, routes, and traits.
 * 
 * [ES] Espacio de nombres primario de Barrits exportado a los consumidores.
 * Presenta una estructura de orquestación fractal que contiene lógica, rutas y traits.
 */
export const barrits = {
  /** [EN] Algorithm and logic libraries. [ES] Librerías de algoritmos y lógica. */
  logic,
  /** [EN] Path routing and parsing. [ES] Enrutamiento y parseo de rutas. */
  routes,
  /** [EN] Trait composition engine. [ES] Motor de composición de traits. */
  traits,
};

/**
 * [EN] Short alias of the Barrits domain namespace (brt).
 * [ES] Alias corto del espacio de nombres de Barrits (brt).
 */
export const brt = barrits;