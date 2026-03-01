/*
 * Deterministic, metadata-only rule registry.
 *
 * IMPORTANT:
 * - This file intentionally contains NO evaluation logic and must not change engine semantics.
 * - Deterministic only: stable literals (no Date.now(), Math.random(), etc.).
 * - No runtime mutation: exports are frozen / readonly and must not be mutated by callers.
 */

/**
 * Analyzer-level policy version constant.
 *
 * This is intentionally a simple string literal export so other parts of the frontend
 * can report or display which policy version they are aligned to, without affecting
 * evaluation semantics.
 */
export const POLICY_VERSION = "1.0.0";

/**
 * Rule registry entry (metadata-only).
 *
 * Required fields (per specification):
 * - ruleCode
 * - domain
 * - description
 * - documentReference
 * - introducedInPolicyVersion
 *
 * @typedef {Object} RuleRegistryEntry
 * @property {string} ruleCode
 * @property {string} domain
 * @property {string} description
 * @property {string} documentReference
 * @property {string} introducedInPolicyVersion
 */

/**
 * Backwards-compatible alias for "metadata".
 *
 * @typedef {RuleRegistryEntry} RuleMetadata
 */

/**
 * Canonical registry map (keyed by ruleCode).
 *
 * @typedef {Object.<string, RuleRegistryEntry>} RuleRegistryMap
 */

/*
 * The canonical registry map (keyed by ruleCode).
 *
 * Determinism rules:
 * - Keep as a literal object.
 * - Keep ordering stable (append new keys; do not reorder without intent).
 * - Do not compute fields dynamically.
 *
 * NOTE: This registry is metadata-only. Do not add evaluation logic here.
 */
const RULE_REGISTRY_INTERNAL = {
  // Append-only ordering (authoritative list order). Do not reorder.
  "SOVR-001": {
    ruleCode: "SOVR-001",
    domain: "governance",
    description: "Metadata-only registry entry for authoritative governance rule.",
    documentReference: "Canonical Governance Rules",
    introducedInPolicyVersion: "1.0.0",
  },
  "SOVR-002": {
    ruleCode: "SOVR-002",
    domain: "governance",
    description: "Metadata-only registry entry for authoritative governance rule.",
    documentReference: "Canonical Governance Rules",
    introducedInPolicyVersion: "1.0.0",
  },
  "SOVR-003": {
    ruleCode: "SOVR-003",
    domain: "governance",
    description: "Metadata-only registry entry for authoritative governance rule.",
    documentReference: "Canonical Governance Rules",
    introducedInPolicyVersion: "1.0.0",
  },
  "SOVR-004": {
    ruleCode: "SOVR-004",
    domain: "governance",
    description: "Metadata-only registry entry for authoritative governance rule.",
    documentReference: "Canonical Governance Rules",
    introducedInPolicyVersion: "1.0.0",
  },
  "COMP-001": {
    ruleCode: "COMP-001",
    domain: "governance",
    description: "Metadata-only registry entry for authoritative governance rule.",
    documentReference: "Canonical Governance Rules",
    introducedInPolicyVersion: "1.0.0",
  },
  "CINT-001": {
    ruleCode: "CINT-001",
    domain: "governance",
    description: "Metadata-only registry entry for authoritative governance rule.",
    documentReference: "Canonical Governance Rules",
    introducedInPolicyVersion: "1.0.0",
  },
  "CINT-002": {
    ruleCode: "CINT-002",
    domain: "governance",
    description: "Metadata-only registry entry for authoritative governance rule.",
    documentReference: "Canonical Governance Rules",
    introducedInPolicyVersion: "1.0.0",
  },
  "CINT-003": {
    ruleCode: "CINT-003",
    domain: "governance",
    description: "Metadata-only registry entry for authoritative governance rule.",
    documentReference: "Canonical Governance Rules",
    introducedInPolicyVersion: "1.0.0",
  },
  "SUBS-001": {
    ruleCode: "SUBS-001",
    domain: "governance",
    description: "Metadata-only registry entry for authoritative governance rule.",
    documentReference: "Canonical Governance Rules",
    introducedInPolicyVersion: "1.0.0",
  },
  "INTF-001": {
    ruleCode: "INTF-001",
    domain: "governance",
    description: "Metadata-only registry entry for authoritative governance rule.",
    documentReference: "Canonical Governance Rules",
    introducedInPolicyVersion: "1.0.0",
  },
  "PROD-001": {
    ruleCode: "PROD-001",
    domain: "governance",
    description: "Metadata-only registry entry for authoritative governance rule.",
    documentReference: "Canonical Governance Rules",
    introducedInPolicyVersion: "1.0.0",
  },
  "PROD-002": {
    ruleCode: "PROD-002",
    domain: "governance",
    description: "Metadata-only registry entry for authoritative governance rule.",
    documentReference: "Canonical Governance Rules",
    introducedInPolicyVersion: "1.0.0",
  },
};

/*
 * Frozen, readonly registry (metadata-only, deterministic semantics).
 *
 * We freeze at runtime to defend against accidental mutation in JS consumers.
 */
/** @type {RuleRegistryMap} */
export const RULE_REGISTRY = Object.freeze(RULE_REGISTRY_INTERNAL);

/*
 * Deterministic lookup map for rule metadata by code.
 *
 * This separate export preserves prior public surface area and calling patterns.
 */
/** @type {RuleRegistryMap} */
export const RULE_REGISTRY_BY_CODE = RULE_REGISTRY;

/*
 * Deterministic readonly list view of the registry entries.
 *
 * This is a literal list in authoritative order (no dynamic computation).
 */
/** @type {readonly RuleRegistryEntry[]} */
const RULE_REGISTRY_LIST = Object.freeze([
  RULE_REGISTRY_INTERNAL["SOVR-001"],
  RULE_REGISTRY_INTERNAL["SOVR-002"],
  RULE_REGISTRY_INTERNAL["SOVR-003"],
  RULE_REGISTRY_INTERNAL["SOVR-004"],
  RULE_REGISTRY_INTERNAL["COMP-001"],
  RULE_REGISTRY_INTERNAL["CINT-001"],
  RULE_REGISTRY_INTERNAL["CINT-002"],
  RULE_REGISTRY_INTERNAL["CINT-003"],
  RULE_REGISTRY_INTERNAL["SUBS-001"],
  RULE_REGISTRY_INTERNAL["INTF-001"],
  RULE_REGISTRY_INTERNAL["PROD-001"],
  RULE_REGISTRY_INTERNAL["PROD-002"],
]);

/**
 * PUBLIC_INTERFACE
 * Get metadata for a given rule code, if it exists in the registry.
 *
 * @param {string} ruleCode - The rule code to look up.
 * @returns {RuleMetadata|undefined} The associated rule metadata if present; otherwise undefined.
 */
export function getRuleMetadata(ruleCode) {
  return RULE_REGISTRY_BY_CODE[ruleCode];
}

/**
 * PUBLIC_INTERFACE
 * List all registered rule metadata entries as a readonly array.
 *
 * @returns {readonly RuleMetadata[]} A frozen readonly array of all rule metadata entries.
 */
export function listRuleMetadata() {
  return RULE_REGISTRY_LIST;
}
