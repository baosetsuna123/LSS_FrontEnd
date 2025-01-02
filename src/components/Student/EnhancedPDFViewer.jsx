import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const EnhancedPDFViewer = ({ url }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) =>
      Math.min(Math.max(prevPageNumber + offset, 1), numPages)
    );
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div
      className={`flex flex-col items-center ${
        isFullScreen
          ? "fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center"
          : ""
      }`}
    >
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div className="text-gray-600">Loading PDF...</div>}
      >
        <Page pageNumber={pageNumber} width={isFullScreen ? 800 : 300} />
      </Document>
      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={() => changePage(-1)}
          disabled={pageNumber <= 1}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm">{`Page ${pageNumber} of ${numPages}`}</span>
        <button
          onClick={() => changePage(1)}
          disabled={pageNumber >= numPages}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
        <button
          onClick={toggleFullScreen}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          {isFullScreen ? "Exit Full Screen" : "Full Screen"}
        </button>
      </div>
    </div>
  );
};

export default EnhancedPDFViewer;
