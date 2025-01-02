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
  return (
    <>
      <section className="w-full dark:text-white py-4 bg-gray-100 text-gray-100 dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-900 ">
        <div className="container dark:text-white px-4 md:px-6">
          <Breadcrumb
            items={[
              { label: "Home", link: "/" },
              { label: "Lesson", link: "/class" },
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
        <h1 className="text-3xl font-bold mb-6 text-center">Documents</h1>
        <div className="flex flex-wrap justify-between gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col justify-between w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
            >
              {/* Document Header */}
              <div className="bg-gray-100 dark:bg-gray-700 p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="truncate text-center">{doc.title}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-4">
                <p className="text-sm text-gray-600 text-center dark:text-gray-400 mb-2">
                  Course Code: {doc.courseCode}
                </p>
                <p className="text-sm mb-4 line-clamp-3 text-center">
                  {doc.content}
                </p>
              </div>

              {/* PDF Embed */}
              <div className="flex-1 flex justify-center items-center p-4">
                {/* Check file type and render accordingly */}
                {doc.filePath.endsWith(".pdf") ? (
                  <embed
                    src={doc.filePath}
                    type="application/pdf"
                    width="100%"
                    height="400px"
                    className="border border-gray-300 rounded"
                    style={{ border: "none" }}
                  />
                ) : doc.filePath.endsWith(".jpg") ||
                  doc.filePath.endsWith(".jpeg") ||
                  doc.filePath.endsWith(".png") ? (
                  <img
                    src={doc.filePath}
                    alt={doc.title}
                    width="100%"
                    height="400px"
                    className="object-cover border border-gray-300 rounded"
                  />
                ) : doc.filePath.endsWith(".docx") ? (
                  <div className="p-4">
                    {/* Use a library like mammoth.js or render DOCX content */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      DOCX files are not directly rendered here. Please download
                      to view.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownload(doc.filePath, `${doc.title}.docx`)
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download DOCX
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Unsupported file type. Please download to view.
                  </p>
                )}
              </div>

              {/* Footer with buttons */}
              <div className="p-4 flex justify-between items-center">
                <div className="flex justify-between items-center w-full gap-2">
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
                    onClick={() => window.open(doc.filePath, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Documents;
