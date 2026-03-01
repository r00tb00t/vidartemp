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

/** The severity level associated with a rule (metadata-only). */
export type RuleSeverity = "CRITICAL" | "WARNING" | "INFORMATIONAL";

/** Optional coarse category used for grouping in UI/Docs (metadata-only). */
export type RuleCategory =
  | "SOVEREIGNTY"
  | "ZERO_CLOUD"
  | "PRODUCT"
  | "DEPENDENCY"
  | "SECURITY"
  | "COMPLIANCE"
  | "OTHER";

/*
 * Rule registry entry (metadata-only).
 *
 * Required fields (per specification):
 * - ruleCode
 * - domain
 * - description
 * - documentReference
 * - introducedInPolicyVersion
 */
export type RuleRegistryEntry = {
  readonly ruleCode: string;
  readonly domain: string;
  readonly description: string;
  readonly documentReference: string;
  readonly introducedInPolicyVersion: string;
};

/* Backwards-compatible alias for "metadata". */
export type RuleMetadata = RuleRegistryEntry;

/*
 * Canonical registry map (keyed by ruleCode).
 *
 * Using `Readonly<Record<...>>` ensures:
 * - callers cannot mutate the map through the type system
 * - registry keys are strings
 * - each value must structurally match RuleRegistryEntry
 */
export type RuleRegistryMap = Readonly<Record<string, RuleRegistryEntry>>;

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
} as const satisfies RuleRegistryMap;

/*
 * Frozen, readonly registry (metadata-only, deterministic semantics).
 *
 * We freeze at runtime to defend against accidental mutation in JS consumers.
 * The explicit cast preserves the index-signature type for lookup usage.
 */
export const RULE_REGISTRY: RuleRegistryMap = Object.freeze(
  RULE_REGISTRY_INTERNAL as RuleRegistryMap,
);

/*
 * Deterministic lookup map for rule metadata by code.
 *
 * This separate export preserves prior public surface area and calling patterns.
 */
export const RULE_REGISTRY_BY_CODE: RuleRegistryMap = RULE_REGISTRY;

/*
 * Deterministic readonly list view of the registry entries.
 *
 * This is a literal list in authoritative order (no dynamic computation).
 */
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
]) as readonly RuleRegistryEntry[];

/**
 * PUBLIC_INTERFACE
 * Get metadata for a given rule code, if it exists in the registry.
 *
 * @param ruleCode - The rule code to look up.
 * @returns The associated rule metadata if present; otherwise undefined.
 */
export function getRuleMetadata(ruleCode: string): RuleMetadata | undefined {
  return RULE_REGISTRY_BY_CODE[ruleCode];
}

/**
 * PUBLIC_INTERFACE
 * List all registered rule metadata entries as a readonly array.
 *
 * @returns A frozen readonly array of all rule metadata entries.
 */
export function listRuleMetadata(): readonly RuleMetadata[] {
  return RULE_REGISTRY_LIST;
}
