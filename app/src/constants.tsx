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
      label: "Change Language",
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

export const defaultConfig = {
  meta: {
    title: "New",
    author: "",
    status: "",
    date: "",
    basedOn: "",
    basedOnFrom: "",
    type: "Screenplay",
  },
  report: {
    enabled: true,
    listDialogues: true,
  },
  addReport: true,
  layout: {
    lineHeight: 4.8,
    linePerPage: 55,
    marginRight: 10,
    marginLeft: 35,
    marginTop: 22,
    pageNumberMarginTop: 10,
  },
  i18n: {
    common: {
      screenplay: "Drehbuch",
      untitled: "Ohne Titel",
      writtenBy: "Geschrieben von",
      by: "von",
      story: "Geschichte",
      chapter_one: "Kapitel",
      chapter_other: "Kapitel",
      scene_one: "Szene",
      scene_other: "Szenen",
      song_one: "Lied",
      song_other: "Lieder",
      character_one: "Charakter",
      character_other: "Charaktere",
      transition_one: "Übergang",
      transition_other: "Übergänge",
      line_one: "Zeile",
      line_other: "Zeilen",
      dialogue_one: "Dialog",
      dialogue_other: "Dialoge",
      action_one: "Regieanweisung",
      action_other: "Regieanweisungen",
      verse_one: "Strophe",
      verse_other: "Strophen",
      lyrics: "Liedtexte",
    },
  },
};
