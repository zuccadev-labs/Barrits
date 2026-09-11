/**
 * @module
 * [EN] Public `barrits.logic` surface. Re-exports the whole standard library (`barrits_lib/logic`) and exposes the
 * flat `logic` namespace object consumed by `barrits.logic.<member>`. The object is derived from the library's
 * runtime exports, so the three surfaces (named exports, `logic`, `logicFamilies`) can never drift apart.
 * [ES] Superficie pública `barrits.logic`. Re-exporta toda la librería estándar (`barrits_lib/logic`) y expone el objeto
 * plano `logic` consumido por `barrits.logic.<miembro>`. El objeto se deriva de los exports runtime de la librería, de
 * modo que las tres superficies (exports nombrados, `logic`, `logicFamilies`) nunca pueden divergir.
 */
import * as library from "../../barrits_lib/logic";

export * from "../../barrits_lib/logic";

const { logicFamilies: _logicFamilies, ...flatLibrary } = library;

/**
 * [EN] Flat logic namespace exposed under `barrits.logic` / `brt.logic`: every function and algorithm family of the
 * standard library keyed by its export name (`barrits.logic.orderBy`, `barrits.logic.slugify`,
 * `barrits.logic.searchAlgorithms.binarySearch`). Grouped access by domain lives in `logicFamilies`.
 * [ES] Espacio de nombres plano expuesto bajo `barrits.logic` / `brt.logic`: cada función y familia de algoritmos de la
 * librería estándar indexada por su nombre de export (`barrits.logic.orderBy`, `barrits.logic.slugify`,
 * `barrits.logic.searchAlgorithms.binarySearch`). El acceso agrupado por dominio vive en `logicFamilies`.
 */
export const logic: Omit<typeof library, "logicFamilies"> = flatLibrary;
