/*
 * Deterministic, metadata-only rule registry.
 *
 * IMPORTANT:
 * - This file intentionally contains NO evaluation logic and must not change engine semantics.
 * - Deterministic only: stable literals (no Date.now(), Math.random(), etc.).
 * - No runtime mutation: exports are frozen / readonly and must not be mutated by callers.
 */

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
 * NOTE: This registry is intentionally empty in this template to avoid guessing rule codes
 * or semantics. Populate with authoritative rule metadata only.
 */
const RULE_REGISTRY_INTERNAL = {
  /**
   * SOVR-* rules: sovereignty advisory metadata (no evaluation logic).
   */
  "SOVR-001": {
    ruleCode: "SOVR-001",
    domain: "sovereignty",
    description: "Sovereignty advisory rule (metadata-only).",
    documentReference: "Sovereignty Advisory Policy",
    introducedInPolicyVersion: "1.0.0",
  },
  "SOVR-002": {
    ruleCode: "SOVR-002",
    domain: "sovereignty",
    description: "Sovereignty advisory rule (metadata-only).",
    documentReference: "Sovereignty Advisory Policy",
    introducedInPolicyVersion: "1.0.0",
  },

  /**
   * ZC-* rules: zero-cloud advisory metadata (no evaluation logic).
   */
  "ZC-001": {
    ruleCode: "ZC-001",
    domain: "zero-cloud",
    description: "Zero-cloud advisory rule (metadata-only).",
    documentReference: "Zero-Cloud Policy",
    introducedInPolicyVersion: "1.0.0",
  },

  /**
   * PROD-* rules: product advisory metadata (no evaluation logic).
   */
  "PROD-001": {
    ruleCode: "PROD-001",
    domain: "product",
    description: "Product advisory rule (metadata-only).",
    documentReference: "Product Advisory Policy",
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
 * We compute it once and freeze it so callers cannot mutate the returned array.
 * Object.values preserves insertion order of string keys in modern JS engines.
 */
const RULE_REGISTRY_LIST = Object.freeze(
  Object.values(RULE_REGISTRY_BY_CODE),
) as readonly RuleRegistryEntry[];

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
