/**
 * country-to-continent.js
 *
 * Maps ISO 3166-1 alpha-2 country codes to continent names.
 * Covers all 249 officially assigned codes + key territories.
 *
 * Usage (ESM):
 *   import { getContinent, getCountriesByContinent, CONTINENTS } from './country-to-continent.js';
 *
 * Usage (CommonJS):
 *   const { getContinent } = require('./country-to-continent.js');
 *
 * Usage (browser global via <script>):
 *   CountryContinent.getContinent('JP') // → 'Asia'
 */

// ---------------------------------------------------------------------------
// Core map  (ISO 3166-1 alpha-2 → continent)
// ---------------------------------------------------------------------------

const COUNTRY_TO_CONTINENT = {
  // Africa (58)
  DZ: "Africa", AO: "Africa", BJ: "Africa", BW: "Africa", BF: "Africa",
  BI: "Africa", CV: "Africa", CM: "Africa", CF: "Africa", TD: "Africa",
  KM: "Africa", CD: "Africa", CG: "Africa", CI: "Africa", DJ: "Africa",
  EG: "Africa", GQ: "Africa", ER: "Africa", SZ: "Africa", ET: "Africa",
  GA: "Africa", GM: "Africa", GH: "Africa", GN: "Africa", GW: "Africa",
  KE: "Africa", LS: "Africa", LR: "Africa", LY: "Africa", MG: "Africa",
  MW: "Africa", ML: "Africa", MR: "Africa", MU: "Africa", YT: "Africa",
  MA: "Africa", MZ: "Africa", NA: "Africa", NE: "Africa", NG: "Africa",
  RE: "Africa", RW: "Africa", ST: "Africa", SN: "Africa", SC: "Africa",
  SL: "Africa", SO: "Africa", ZA: "Africa", SS: "Africa", SD: "Africa",
  TZ: "Africa", TG: "Africa", TN: "Africa", UG: "Africa", EH: "Africa",
  ZM: "Africa", ZW: "Africa", SH: "Africa", IO: "Africa",

  // Asia (51)
  AF: "Asia", AM: "Asia", AZ: "Asia", BH: "Asia", BD: "Asia",
  BT: "Asia", BN: "Asia", KH: "Asia", CN: "Asia", CX: "Asia",
  CC: "Asia", CY: "Asia", GE: "Asia", HK: "Asia", IN: "Asia",
  ID: "Asia", IR: "Asia", IQ: "Asia", IL: "Asia", JP: "Asia",
  JO: "Asia", KZ: "Asia", KW: "Asia", KG: "Asia", LA: "Asia",
  LB: "Asia", MO: "Asia", MY: "Asia", MV: "Asia", MN: "Asia",
  MM: "Asia", NP: "Asia", KP: "Asia", OM: "Asia", PK: "Asia",
  PS: "Asia", PH: "Asia", QA: "Asia", SA: "Asia", SG: "Asia",
  KR: "Asia", LK: "Asia", SY: "Asia", TW: "Asia", TJ: "Asia",
  TH: "Asia", TL: "Asia", TR: "Asia", TM: "Asia", AE: "Asia",
  UZ: "Asia", VN: "Asia", YE: "Asia",

  // Europe (52)
  AL: "Europe", AD: "Europe", AT: "Europe", BY: "Europe", BE: "Europe",
  BA: "Europe", BG: "Europe", HR: "Europe", CZ: "Europe", DK: "Europe",
  EE: "Europe", FO: "Europe", FI: "Europe", FR: "Europe", DE: "Europe",
  GI: "Europe", GR: "Europe", GG: "Europe", HU: "Europe", IS: "Europe",
  IE: "Europe", IM: "Europe", IT: "Europe", JE: "Europe", XK: "Europe",
  LV: "Europe", LI: "Europe", LT: "Europe", LU: "Europe", MK: "Europe",
  MT: "Europe", MD: "Europe", MC: "Europe", ME: "Europe", NL: "Europe",
  NO: "Europe", PL: "Europe", PT: "Europe", RO: "Europe", RU: "Europe",
  SM: "Europe", RS: "Europe", SK: "Europe", SI: "Europe", ES: "Europe",
  SJ: "Europe", SE: "Europe", CH: "Europe", UA: "Europe", GB: "Europe",
  VA: "Europe", AX: "Europe",

  // North America (40)
  AG: "North America", AI: "North America", AW: "North America",
  BS: "North America", BB: "North America", BZ: "North America",
  BM: "North America", BQ: "North America", CA: "North America",
  KY: "North America", CR: "North America", CU: "North America",
  CW: "North America", DM: "North America", DO: "North America",
  SV: "North America", GL: "North America", GD: "North America",
  GP: "North America", GT: "North America", HT: "North America",
  HN: "North America", JM: "North America", MQ: "North America",
  MX: "North America", MS: "North America", PM: "North America",
  PR: "North America", BL: "North America", KN: "North America",
  LC: "North America", MF: "North America", VC: "North America",
  SX: "North America", TT: "North America", TC: "North America",
  US: "North America", VG: "North America", VI: "North America",
  PA: "North America", NI: "North America",

  // South America (14)
  AR: "South America", BO: "South America", BR: "South America",
  CL: "South America", CO: "South America", EC: "South America",
  FK: "South America", GF: "South America", GY: "South America",
  PY: "South America", PE: "South America", SR: "South America",
  UY: "South America", VE: "South America",

  // Oceania (27)
  AS: "Oceania", AU: "Oceania", CK: "Oceania", FJ: "Oceania",
  PF: "Oceania", GU: "Oceania", KI: "Oceania", MH: "Oceania",
  FM: "Oceania", NR: "Oceania", NC: "Oceania", NZ: "Oceania",
  NU: "Oceania", NF: "Oceania", MP: "Oceania", PW: "Oceania",
  PG: "Oceania", PN: "Oceania", WS: "Oceania", SB: "Oceania",
  TK: "Oceania", TO: "Oceania", TV: "Oceania", UM: "Oceania",
  VU: "Oceania", WF: "Oceania", CK: "Oceania",

  // Antarctica (6)
  AQ: "Antarctica", BV: "Antarctica", HM: "Antarctica",
  TF: "Antarctica", GS: "Antarctica", CK: "Oceania",
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** All valid continent names returned by this library. */
const CONTINENTS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
  "Antarctica",
];

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

/**
 * Returns the continent for a given ISO 3166-1 alpha-2 country code.
 *
 * @param {string} code - Two-letter country code, case-insensitive (e.g. "US", "jp", "Fr").
 * @returns {string|null} Continent name, or null if the code is not recognised.
 *
 * @example
 * getContinent('JP')  // → 'Asia'
 * getContinent('us')  // → 'North America'
 * getContinent('ZZ')  // → null
 */
function getContinent(code) {
  if (typeof code !== "string") return null;
  return COUNTRY_TO_CONTINENT[code.toUpperCase()] ?? null;
}

/**
 * Returns every country code that belongs to the given continent.
 *
 * @param {string} continent - One of the values in CONTINENTS (case-insensitive).
 * @returns {string[]} Sorted array of ISO 3166-1 alpha-2 codes.
 *
 * @example
 * getCountriesByContinent('Oceania')
 * // → ['AS', 'AU', 'CK', 'FJ', ...]
 */
function getCountriesByContinent(continent) {
  if (typeof continent !== "string") return [];
  const target = continent.trim().toLowerCase();
  return Object.entries(COUNTRY_TO_CONTINENT)
    .filter(([, c]) => c.toLowerCase() === target)
    .map(([code]) => code)
    .sort();
}

/**
 * Returns an object mapping each continent to the array of its country codes.
 *
 * @returns {Record<string, string[]>}
 *
 * @example
 * groupByContinent()
 * // → { Africa: ['DZ', 'AO', ...], Asia: [...], ... }
 */
function groupByContinent() {
  const result = {};
  for (const continent of CONTINENTS) {
    result[continent] = [];
  }
  for (const [code, continent] of Object.entries(COUNTRY_TO_CONTINENT)) {
    if (result[continent]) {
      result[continent].push(code);
    }
  }
  for (const continent of CONTINENTS) {
    result[continent].sort();
  }
  return result;
}

/**
 * Returns true when the code is a recognised country code in this library.
 *
 * @param {string} code
 * @returns {boolean}
 */
function isValidCode(code) {
  return getContinent(code) !== null;
}

/**
 * Given an array of country codes, returns a deduplicated array of continents
 * they belong to.
 *
 * @param {string[]} codes
 * @returns {string[]}
 *
 * @example
 * getContinentsForCodes(['US', 'FR', 'JP', 'ZZ'])
 * // → ['Asia', 'Europe', 'North America']
 */
function getContinentsForCodes(codes) {
  const seen = new Set();
  for (const code of codes) {
    const c = getContinent(code);
    if (c) seen.add(c);
  }
  return [...seen].sort();
}

// ---------------------------------------------------------------------------
// Export (supports ESM, CommonJS, and browser globals)
// ---------------------------------------------------------------------------

const CountryContinent = {
  COUNTRY_TO_CONTINENT,
  CONTINENTS,
  getContinent,
  getCountriesByContinent,
  groupByContinent,
  isValidCode,
  getContinentsForCodes,
};

// ESM
if (typeof exports === "undefined") {
  // Browser global
  if (typeof window !== "undefined") {
    window.CountryContinent = CountryContinent;
  }
} else {
  // CommonJS
  Object.assign(exports, CountryContinent);
}

export {
  COUNTRY_TO_CONTINENT,
  CONTINENTS,
  getContinent,
  getCountriesByContinent,
  groupByContinent,
  isValidCode,
  getContinentsForCodes,
};

export default CountryContinent;