/**
 * Deterministic, metadata-only rule registry.
 *
 * IMPORTANT:
 * - This file intentionally contains *no* evaluation logic and must not change engine semantics.
 * - Deterministic only: stable literals (no Date.now, Math.random, etc.).
 * - No runtime mutation: the registry object is frozen after declaration.
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

/**
 * Rule registry entry (metadata-only).
 *
 * Required fields (per specification):
 * - ruleCode
 * - domain
 * - description
 * - documentReference
 * - introducedInPolicyVersion
 */
export type RuleRegistryEntry = Readonly<{
  ruleCode: string;
  domain: string;
  description: string;
  documentReference: string;
  introducedInPolicyVersion: string;
}>;

/**
 * Backwards-compatible alias for "metadata".
 * (This file is metadata-only; naming here must not affect evaluation semantics.)
 */
export type RuleMetadata = RuleRegistryEntry;

/**
 * The canonical registry map (keyed by ruleCode).
 *
 * Determinism rules:
 * - Keep as a literal object.
 * - Keep ordering stable (append new keys; do not reorder without intent).
 * - Do not compute fields dynamically.
 *
 * NOTE:
 * The declaration below MUST remain in the exact form (no `satisfies`):
 * `export const RULE_REGISTRY: Readonly<Record<string, RuleRegistryEntry>> = { ... } as Record<string, RuleRegistryEntry>;`
 */
export const RULE_REGISTRY: Readonly<Record<string, RuleRegistryEntry>> =
  {
    // NOTE: The authoritative rule list/metadata should be populated here.
    // This registry is intentionally empty to avoid guessing rule codes or semantics.
  } as Record<string, RuleRegistryEntry>;

// Freeze to prevent runtime mutation (metadata-only, deterministic semantics).
Object.freeze(RULE_REGISTRY);

/**
 * Deterministic lookup map for rule metadata by code.
 *
 * We intentionally widen the type to a string-indexed map for safe indexing via
 * `map[ruleCode]` under strict TypeScript.
 */
export const RULE_REGISTRY_BY_CODE: Readonly<Record<string, RuleRegistryEntry>> =
  RULE_REGISTRY;

/**
 * Deterministic readonly list view of the registry entries.
 *
 * We freeze the resulting array to prevent accidental mutation by callers.
 * `Object.values` typing can be broad under strict TS, so we cast explicitly.
 */
const RULE_REGISTRY_LIST: readonly RuleRegistryEntry[] = Object.freeze(
  Object.values(RULE_REGISTRY_BY_CODE) as RuleRegistryEntry[]
);

// PUBLIC_INTERFACE
export function getRuleMetadata(ruleCode: string): RuleMetadata | undefined {
  /**
   * Return the metadata for a given rule code, if it exists in the registry.
   * This function is metadata-only and has no side effects.
   */
  return RULE_REGISTRY_BY_CODE[ruleCode];
}

// PUBLIC_INTERFACE
export function listRuleMetadata(): readonly RuleMetadata[] {
  /**
   * Return the full rule registry list (readonly).
   * Callers must not mutate returned data.
   */
  return RULE_REGISTRY_LIST;
}
