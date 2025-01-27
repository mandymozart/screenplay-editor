// import Screenplayyy from "screenplayyy";
import Screenplayyy from "../../../lib/src/index.js";

export default (req, res) => {
  try {
    const { format, screenplay, config } = req.body;

    if (format !== "pdf") {
      return res
        .status(400)
        .send({ error: "Unsupported format. Only 'pdf' is allowed." });
    }

    try {
      const doc = Screenplayyy.renderFromScreenplay({
        screenplay: screenplay,
        config: config,
      });

      const pdfBuffer = doc.output("arraybuffer");

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=screenplay.pdf");

      res.send(Buffer.from(pdfBuffer));
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).send({ error: "Failed to generate PDF" });
    }
  } catch (error) {
    console.error("Error in PDF generation endpoint:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
