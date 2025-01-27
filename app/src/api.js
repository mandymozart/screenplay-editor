// src/api.js
import { API_BASE_URL } from "./config";

class Api {
  static async request(endpoint, method = "GET", body = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response;
  }

  static async generatePDF(screenplay, config) {
    try {
      const response = await this.request("generate-pdf", "POST", {
        format: "pdf",
        screenplay,
        config,
      });

      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${config.meta?.title || "Untitled"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(pdfUrl); // Clean up the object URL after use
    } catch (error) {
      throw new Error("Failed to export PDF: " + error.message);
    }
  }

  static async parse(content) {
    try {
      const response = await this.request("screenplay", "POST", { content });

      if (!response.ok) {
        throw new Error("Failed to parse screenplay on server");
      }

      const parsedScreenplay = await response.json();
      return parsedScreenplay;
    } catch (error) {
      throw new Error("Unknown");
    }
  }
}

export default Api;
