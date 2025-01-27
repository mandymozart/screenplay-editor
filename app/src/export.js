class Export {
  static exportJSON(screenplay, config) {
    const fileName = `${config.meta?.title || "Untitled"}.json`;

    const combinedData = {
      exportDate: new Date().toISOString(),
      screenplay,
      config,
    };

    const blob = new Blob([JSON.stringify(combinedData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}

export default Export;
