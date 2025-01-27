import React from "react";
import { useDropzone } from "react-dropzone";
import "./FileUploads.css";

type FileUploadsProps = {
  handleFile: (file: File) => void;
};

const FileUploads: React.FC<FileUploadsProps> = ({ handleFile }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => handleFile(file));
    },
    accept: { "text/plain": [".txt"], "application/json": [".json"] },
    multiple: true,
  });

  return (
    <div className="file-uploads">
      <p>
        Please upload both <strong>screenplay.txt</strong> and{" "}
        <strong>config.json</strong> files.
      </p>

      <div>
        <label htmlFor="file-upload" className="file-upload-label">
          Upload Files
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".txt, .json"
          onChange={(e) => {
            const files = e.target.files;
            if (files) Array.from(files).forEach(handleFile);
          }}
          style={{ display: "none" }}
        />
      </div>

      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag & drop the files here, or click to upload</p>
      </div>
    </div>
  );
};

export default FileUploads;
