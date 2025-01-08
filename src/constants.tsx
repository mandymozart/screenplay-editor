export const menu = {
    name: "Main Menu",
    items: [
      {
        label: "Contribute",
        group: [
          { action: "downloadJson", label: "DOWNLOAD JSON" },
          { action: "submitReview", label: "SUBMIT REVIEW" },
          { action: "submitTranslation", label: "SUBMIT TRANSLATION" },
        ],
      },
      {
        label:"Change Language",
        group: [
          { action: "setLanguageDe", label: "DE" },
          { action: "setLanguageEn", label: "EN" },
        ],
      },
      {
        group: [{ action: "info", label: "INFO" }],
      },
    ],
  };