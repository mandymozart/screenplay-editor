export function configIsValid(config) {
  console.log(config);
  if (!config) {
    console.error("Error: Configuration object is missing.");
    return false;
  }

  const missingKeys = [];
  const invalidKeys = [];

  // Check 'meta' keys
  const metaKeys = [
    "title",
    "author",
    "status",
    "date",
    "basedOn",
    "basedOnFrom",
    "type",
  ];
  metaKeys.forEach((key) => {
    if (!config.meta || config.meta[key] === undefined)
      missingKeys.push(`meta.${key}`);
  });

  // Check 'layout' keys
  const layoutKeys = [
    "lineHeight",
    "linePerPage",
    "marginRight",
    "marginLeft",
    "marginTop",
    "pageNumberMarginTop",
  ];
  layoutKeys.forEach((key) => {
    const value = config.layout ? config.layout[key] : undefined;
    if (value === undefined) {
      // If the key is missing, it defaults properly in the script
      return;
    }
    if (typeof value !== "number") invalidKeys.push(`layout.${key}`);
  });

  // Check 'i18n.common' keys
  const i18nCommonKeys = [
    "screenplay",
    "untitled",
    "writtenBy",
    "by",
    "story",
    "chapter_one",
    "chapter_other",
    "scene_one",
    "scene_other",
    "song_one",
    "song_other",
    "character_one",
    "character_other",
    "transition_one",
    "transition_other",
    "line_one",
    "line_other",
    "dialogue_one",
    "dialogue_other",
    "action_one",
    "action_other",
    "verse_one",
    "verse_other",
    "lyrics",
  ];
  i18nCommonKeys.forEach((key) => {
    if (
      !config.i18n ||
      !config.i18n.common ||
      config.i18n.common[key] === undefined
    ) {
      missingKeys.push(`i18n.common.${key}`);
    }
  });

  // Log missing and invalid keys
  if (missingKeys.length > 0) {
    console.error("Error: Missing configuration keys:");
    missingKeys.forEach((key) => console.error(`  - ${key}`));
  }

  if (invalidKeys.length > 0) {
    console.error(
      "Error: Invalid configuration keys (expected numerical values):"
    );
    invalidKeys.forEach((key) => console.error(`  - ${key}`));
  }

  return missingKeys.length === 0 && invalidKeys.length === 0;
}
