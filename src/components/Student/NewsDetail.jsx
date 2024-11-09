import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getNewsById, getAllNews } from "@/data/api"; // Assuming getAllNews is imported
import Breadcrumb from "../Home/Breadcrumb";
import { useNavigate } from "react-router-dom";

const formatDateTime = (date, time) => {
  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":");
  return `${day}/${month}/${year.slice(2)} ${hour}:${minute}`;
};

const NewsDetail = () => {
  const [newsDetail, setNewsDetail] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const token = sessionStorage.getItem("token");

        // Fetch the news item by ID
        const newsData = await getNewsById(id, token);
        setNewsDetail(newsData);

        // Fetch all news items
        const allNews = await getAllNews(token);

        // Exclude the current news item from the other news list
        const filteredNews = allNews.filter(
          (newsItem) => newsItem.id !== parseInt(id)
        );

        // Get the first 4 news items for "Tin khác"
        setOtherNews(filteredNews.slice(0, 4));
      } catch (error) {
        setError("Failed to fetch news details.");
        console.error("Error fetching news details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <section className="w-full py-4 bg-gray-100">
        <div className="container px-4 md:px-6">
          <Breadcrumb
            items={[
              { label: "Home", link: "/" },
              { label: "News", link: "/news" },
              { label: "Detail" },
            ]}
          />
        </div>
      </section>

      {newsDetail && (
        <div className="container px-4 md:px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {newsDetail.title}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Created on {formatDateTime(newsDetail.date, newsDetail.time)}
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: newsDetail.content }}
            className="leading-7 text-gray-800"
          />

          {/* Tin khác - Other News Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Other news
            </h2>
            <ul className="space-y-4">
              {otherNews.map((newsItem) => (
                <li
                  key={newsItem.id}
                  className="border-b pb-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate(`/news/${newsItem.id}`)} // Navigate to another news detail
                >
                  <span className="mr-2 text-gray-500">•</span>
                  <span className="text-blue-500 pl-2">
                    {formatDateTime(newsItem.date, newsItem.time)} :
                  </span>
                  <span className="font-medium text-gray-800 pl-2 hover:text-blue-400">
                    {newsItem.title}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </>
  );
};

export default NewsDetail;
