import React, { useState } from "react";
import useScreenplayStore from "./stores/useScreenplayStore";
import Screenplay from "./components/Screenplay/Screenplay";
import FileUploads from "./components/Common/FileUploads";
import "./App.css";
import Api from "./api";
import Export from "./export";
import { isValidConfigFile, isValidScreenplayFile } from "./utils";

type LoadingError = {
  msg: string;
  error: Error;
};

const App: React.FC = () => {
  const {
    screenplay,
    setScreenplay,
    config,
    setConfig,
    clearAll,
    clearConfig,
    clearScreenplay,
  } = useScreenplayStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<LoadingError | null>(null);

  const handleExportPDF = async () => {
    if (!screenplay || !config) {
      alert("Both screenplay and config must be loaded to export.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await Api.generatePDF(screenplay, config); // Using the Api class
    } catch (error: any) {
      console.error("Error exporting PDF:", error);
      setError({
        msg: "Failed to export PDF.",
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    if (!screenplay || !config) {
      alert("Both screenplay and config must be loaded to export.");
      return;
    }

    Export.exportJSON(screenplay, config); // Using the Api class
  };

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const content = reader.result as string;

        if (isValidScreenplayFile(file)) {
          const parsedScreenplay = await Api.parse(content);
          setScreenplay(parsedScreenplay);
        } else if (isValidConfigFile(file, content)) {
          const data = JSON.parse(content);
          setConfig(data);
        } else {
          throw new Error("Unsupported file or incorrect filename");
        }
      } catch (error: any) {
        setError({
          msg: `Failed to process ${file.name}.`,
          error,
        });
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError({
        msg: `Error reading the file ${file.name}.`,
        error: reader.error || new Error("Unknown file reading error"),
      });
      setLoading(false);
    };

    reader.readAsText(file);
  };

  const clear = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear the memory? This will reset both screenplay and config. Make sure to download a local copy before proceeding!"
    );
    if (confirmClear) {
      clearAll();
      alert("Memory cleared. Screenplay and config have been reset.");
    }
  };

  const isReady = screenplay && config;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-slot-left">
          <h1>Screenplayyy</h1>
        </div>
        <div className="app-header-slot-center"></div>
        <div className="app-header-slot-right">
          <button onClick={handleExportPDF}>Export PDF</button>{" "}
          <button onClick={handleExportJSON}>Export JSON</button>
          <button onClick={() => clear()}>Clear All</button>
        </div>
      </header>

      <div className="app-layout">
        {/* Aside Section */}
        <aside className="files">
          <h2>{config?.meta?.title || "No Config Title"}</h2>
          <div className="files-dir">
            <ul>
              <li className={screenplay ? "is-loaded" : "is-missing"}>
                <span className="file-name">screenplay.txt</span>
                <button onClick={() => clearScreenplay()}>x</button>
              </li>
              <li>
                <span className="file-name">config.json</span>
                <button onClick={() => clearConfig()}>x</button>
              </li>
            </ul>
          </div>
          <FileUploads handleFile={handleFile} />

          {error && (
            <div className="error-message">
              <p>{error.msg}</p>
              <p>{error.error.message}</p>
            </div>
          )}
          <footer className="app-footer">Screenplayyy &copy; 2025</footer>
        </aside>

        {/* Main Section */}
        <main>
          {loading && <div className="loading-spinner">Loading...</div>}

          {isReady && !loading && <Screenplay screenplay={screenplay} />}
        </main>
      </div>
    </div>
  );
};

export default App;
