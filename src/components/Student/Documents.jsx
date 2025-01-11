import { FileText, Download, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../Home/Breadcrumb";
import { saveAs } from "file-saver";
const Documents = () => {
  const location = useLocation();
  const documents = location.state?.documents;
  const classId = location.state?.classId;
  console.log(documents);
  if (!documents) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      saveAs(blob, filename);
    } catch (error) {
      console.error("Download failed:", error);
      // You might want to show an error message to the user here
    }
  };
  const isImage = (filePath) =>
    [".jpg", ".jpeg", ".png"].some((ext) => filePath.endsWith(ext));

  const isPDF = (filePath) => filePath.endsWith(".pdf");

  const isDocx = (filePath) => {
    const extensions = [".docx", ".doc", ".dotx", ".dot"]; // Add more Word-related extensions if needed
    return extensions.some((ext) => filePath.toLowerCase().endsWith(ext));
  };
  const isExcel = (filePath) => /\.(xls|xlsx|csv)$/i.test(filePath);
  return (
    <>
      <section className="w-full dark:text-white py-4 bg-gray-100 text-gray-100 dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-900 ">
        <div className="container dark:text-white px-4 md:px-6">
          <Breadcrumb
            items={[
              { label: "Home", link: "/" },
              { label: "Class", link: "/class" },
              {
                label: "Detail",
                link: classId ? `/class/${classId}` : "/class",
              },
              { label: "Documents" },
            ]}
          />
        </div>
      </section>
      <div className="container mx-auto px-4 py-8 w-full">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-center">Documents</h1>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
            >
              {/* Document Header */}
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                  <span className="truncate text-center text-lg font-medium">
                    {doc.title}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                <p className="text-sm text-gray-600 text-center dark:text-gray-400 mb-2">
                  Course Code: {doc.courseCode}
                </p>
                <p className="text-sm mb-4 line-clamp-3 text-center">
                  {doc.content}
                </p>
              </div>

              {/* File Display Section */}
              <div className="flex-1 flex justify-center items-center p-4">
                {isPDF(doc.filePath) ? (
                  <embed
                    src={doc.filePath.replace("http://", "https://")}
                    type="application/pdf"
                    width="100%"
                    height="400px"
                    className="border border-gray-300 rounded"
                    style={{ border: "none" }}
                    aria-label="PDF Document"
                  />
                ) : isImage(doc.filePath) ? (
                  <img
                    src={doc.filePath.replace("http://", "https://")}
                    alt={`Preview of ${doc.title}`}
                    className="object-cover border border-gray-300 rounded"
                    style={{ maxHeight: "400px", width: "100%" }}
                  />
                ) : isDocx(doc.filePath) ? (
                  <div className="text-center p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Previewing DOCX content:
                    </p>
                    <div className="mt-4 border border-gray-300 rounded p-4 bg-gray-50 text-left overflow-auto max-h-96">
                      <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(
                          doc.filePath
                        )}&embedded=true`}
                        width="100%"
                        height="600px"
                        style={{ border: "none" }}
                        title="DOCX Viewer"
                      ></iframe>
                    </div>
                  </div>
                ) : isExcel(doc.filePath) ? ( // Add Excel case here
                  <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                      doc.filePath.replace("http://", "https://")
                    )}`}
                    width="100%"
                    height="400"
                    className="border border-gray-300 rounded"
                    style={{ border: "none" }}
                    title="Excel Viewer"
                  />
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Unsupported file type. Please download to view.
                  </p>
                )}
              </div>

              {/* Footer with Buttons */}
              <div className="p-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDownload(doc.filePath, `${doc.title}.pdf`)
                  }
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    window.open(
                      doc.filePath.replace("http://", "https://"),
                      "_blank"
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Documents;
