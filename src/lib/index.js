/**
 * Just async mounting, updating and unmounting hierarchical carriages.
 * @module ancient-funicular
 */

import Funicular from './funicular';
import Carriage from './carriage';

/**
 * @interface CarriagesByNames
 * @type {Object.<string, Carriage>}
 */

/**
 * @interface CarriageListsByNames
 * @type {Object.<string, CarriagesByIds>}
 */

/**
 * @interface CarriagesByIds
 * @type {Object.<number, Carriage>}
 */

export {
  Funicular as default,
  Carriage,
};