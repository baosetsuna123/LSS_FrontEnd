import { FileText, Download, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../Home/Breadcrumb";
import { saveAs } from "file-saver";
const Documents = () => {
  const location = useLocation();
  const documents = location.state?.documents;
  const classId = location.state?.classId;
  console.log(classId);

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
        <div className="container dark:text-white  px-4 md:px-6">
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Documents</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id} className="overflow-hidden">
              <CardHeader className="bg-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="truncate">{doc.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-2">
                  Course Code: {doc.courseCode}
                </p>
                <p className="text-sm mb-4 line-clamp-3">{doc.content}</p>
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleDownload(doc.filePath, `${doc.title}.jpg`)
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Documents;
