/**
 * Deterministic, metadata-only rule registry.
 *
 * IMPORTANT:
 * - This file intentionally contains *no* evaluation logic and should not change engine semantics.
 * - It is safe to add and leave unused; it becomes behavior-affecting only if imported and used elsewhere.
 * - The registry is deterministic: stable ordering and static literals only (no Date.now, random, etc.).
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
 * Rule metadata.
 *
 * Note: `code` is expected to match the `rule_code` values returned by the backend
 * (e.g., in evaluation violations). This is metadata only; nothing here is used
 * to decide outcomes.
 */
export type RuleMetadata = Readonly<{
  /** Stable identifier for the rule, typically a backend-emitted rule_code. */
  code: string;

  /** Human-friendly name/title. */
  title: string;

  /** Short description of what the rule checks. */
  description?: string;

  /** Default/severity classification (metadata-only). */
  severity?: RuleSeverity;

  /** Category grouping for UX/docs (metadata-only). */
  category?: RuleCategory;

  /** Optional tags/keywords for searching/grouping. */
  tags?: readonly string[];

  /**
   * Optional: stable ordering key for deterministic presentation when needed.
   * If omitted, array order is the source of truth.
   */
  order?: number;

  /** Optional link to external documentation. */
  docsUrl?: string;
}>;

/**
 * The canonical registry list.
 *
 * Determinism rules:
 * - Keep as a literal array.
 * - Keep order stable (append new rules to the end unless a deliberate re-order is required).
 * - Do not compute fields dynamically.
 */
export const RULE_REGISTRY: readonly RuleMetadata[] = Object.freeze(
  [
    // NOTE: The authoritative rule list/metadata should be populated here.
    // This scaffold is intentionally empty to avoid guessing rule codes and semantics.
  ] as const
);

/**
 * Deterministic lookup map for rule metadata by code.
 * Built from RULE_REGISTRY (which is itself deterministic).
 */
export const RULE_REGISTRY_BY_CODE: Readonly<Record<string, RuleMetadata>> = Object.freeze(
  RULE_REGISTRY.reduce<Record<string, RuleMetadata>>((acc, rule) => {
    // In case of accidental duplicates, the first occurrence wins to keep behavior stable.
    if (acc[rule.code] === undefined) acc[rule.code] = rule;
    return acc;
  }, {})
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
  return RULE_REGISTRY;
}
