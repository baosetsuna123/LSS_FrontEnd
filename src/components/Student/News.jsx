import { useEffect, useState } from "react";
import { getAllNews } from "@/data/api";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai"; // Import icons
import Breadcrumb from "../Home/Breadcrumb";
import { useNavigate } from "react-router-dom";

const formatDateTime = (date, time) => {
  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":");
  return `${day}/${month}/${year.slice(2)} ${hour}:${minute}`;
};

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/news/${id}`);
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const data = await getAllNews(token);

        // Sort the news list by date and time in descending order
        const sortedNews = data.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateB - dateA; // Sorting in descending order
        });

        setNewsList(sortedNews);
      } catch (error) {
        setError("Failed to fetch news.");
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "News", link: "/news" },
  ];

  // Calculate page-specific data
  const totalPages = Math.ceil(newsList.length / itemsPerPage);
  const displayedNews = newsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <>
      <section className="w-full py-4 bg-gray-100">
        <div className="container px-4 md:px-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </section>
      <div className="news-container py-6 px-4 ml-10">
        <ul className="space-y-4">
          {displayedNews.length === 0 ? (
            <li>No news available.</li>
          ) : (
            displayedNews.map((newsItem) => (
              <li
                key={newsItem.id}
                className="border-b pb-4 cursor-pointer hover:bg-gray-100" // Add hover effect to the entire row
                onClick={() => handleClick(newsItem.id)} // Add onClick to navigate
              >
                <span className="mr-2 text-gray-500">•</span>
                <span className="text-blue-500 pl-2">
                  {formatDateTime(newsItem.date, newsItem.time)} :
                </span>
                <span className="font-medium text-gray-800 pl-2 hover:text-blue-400">
                  {newsItem.title}
                </span>
              </li>
            ))
          )}
        </ul>

        {/* Pagination Controls */}
        <div className="flex justify-end items-center mt-4 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`${
              currentPage === 1 ? "text-gray-400" : "text-blue-500"
            }`}
          >
            <AiOutlineLeft size={24} />
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`${
              currentPage === totalPages ? "text-gray-400" : "text-blue-500"
            }`}
          >
            <AiOutlineRight size={24} />
          </button>
        </div>
      </div>
    </>
  );
};

export default News;
