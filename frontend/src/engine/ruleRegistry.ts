// Deterministic, metadata-only rule registry.
//
// IMPORTANT:
// - This file intentionally contains no evaluation logic and must not change engine semantics.
// - Deterministic only: stable literals (no Date.now, Math.random, etc.).
// - No runtime mutation: the registry object is frozen after declaration.

// The severity level associated with a rule (metadata-only).
export type RuleSeverity = "CRITICAL" | "WARNING" | "INFORMATIONAL";

// Optional coarse category used for grouping in UI/Docs (metadata-only).
export type RuleCategory =
  | "SOVEREIGNTY"
  | "ZERO_CLOUD"
  | "PRODUCT"
  | "DEPENDENCY"
  | "SECURITY"
  | "COMPLIANCE"
  | "OTHER";

// Rule registry entry (metadata-only).
//
// Required fields (per specification):
// - ruleCode
// - domain
// - description
// - documentReference
// - introducedInPolicyVersion
export type RuleRegistryEntry = {
  readonly ruleCode: string;
  readonly domain: string;
  readonly description: string;
  readonly documentReference: string;
  readonly introducedInPolicyVersion: string;
};

// Backwards-compatible alias for "metadata".
// (This file is metadata-only; naming here must not affect evaluation semantics.)
export type RuleMetadata = RuleRegistryEntry;

// Canonical registry map (keyed by ruleCode).
//
// NOTE: This is an explicit structural readonly type (no Record/Readonly usage).
export type RuleRegistryMap = {
  readonly [ruleCode: string]: RuleRegistryEntry;
};

// The canonical registry map (keyed by ruleCode).
//
// Determinism rules:
// - Keep as a literal object.
// - Keep ordering stable (append new keys; do not reorder without intent).
// - Do not compute fields dynamically.
const RULE_REGISTRY_INTERNAL: { [ruleCode: string]: RuleRegistryEntry } = {
  // NOTE: The authoritative rule list/metadata should be populated here.
  // This registry is intentionally empty to avoid guessing rule codes or semantics.
};

// Frozen, readonly registry (metadata-only, deterministic semantics).
//
// We annotate with our own structural readonly type to avoid utility generic types.
export const RULE_REGISTRY: RuleRegistryMap = Object.freeze(RULE_REGISTRY_INTERNAL);

// Deterministic lookup map for rule metadata by code.
//
// This separate export preserves prior public surface area and calling patterns.
export const RULE_REGISTRY_BY_CODE: RuleRegistryMap = RULE_REGISTRY;

// Deterministic readonly list view of the registry entries.
//
// We build the list without using Object.values (to avoid needing type assertions
// under strict TypeScript). The resulting array is frozen to prevent mutation.
const RULE_REGISTRY_LIST: readonly RuleRegistryEntry[] = (function buildFrozenList() {
  const list: RuleRegistryEntry[] = [];

  // Use a for-in to preserve deterministic enumeration order of string keys.
  // (Insertion order for string keys is stable in modern JS engines.)
  for (const ruleCode in RULE_REGISTRY_BY_CODE) {
    if (Object.prototype.hasOwnProperty.call(RULE_REGISTRY_BY_CODE, ruleCode)) {
      list.push(RULE_REGISTRY_BY_CODE[ruleCode]);
    }
  }

  return Object.freeze(list);
})();

// PUBLIC_INTERFACE
export function getRuleMetadata(ruleCode: string): RuleMetadata | undefined {
  // Return the metadata for a given rule code, if it exists in the registry.
  // This function is metadata-only and has no side effects.
  return RULE_REGISTRY_BY_CODE[ruleCode];
}

// PUBLIC_INTERFACE
export function listRuleMetadata(): readonly RuleMetadata[] {
  // Return the full rule registry list (readonly).
  // Callers must not mutate returned data.
  return RULE_REGISTRY_LIST;
}
