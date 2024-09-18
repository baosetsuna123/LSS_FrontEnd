import { useState } from "react";
import { Link } from "react-router-dom";

const CoursesPage = () => {
  const categories = [
    {
      name: "Computer Science",
      subjects: [
        {
          id: 1,
          title: "Algorithms",
          details: "Learn the basics of algorithms and data processing.",
          price: "$50",
        },
        {
          id: 2,
          title: "Data Structures",
          details:
            "Understand various data structures for better problem-solving.",
          price: "$60",
        },
      ],
    },
    {
      name: "Business",
      subjects: [
        {
          id: 3,
          title: "Marketing",
          details: "Learn modern marketing strategies and tools.",
          price: "$40",
        },
        {
          id: 4,
          title: "Finance",
          details: "Understand corporate finance and financial analysis.",
          price: "$70",
        },
      ],
    },
  ];

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full max-w-lg mx-auto my-10">
      <div className="flex border-b border-gray-200">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`py-2 px-4 text-gray-500 border-b-2 transition duration-300 ${
              activeTab === index
                ? "border-indigo-500 text-indigo-500"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="p-4 bg-white border border-gray-200 mt-2 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          {categories[activeTab].name} Subjects
        </h2>
        <ul>
          {categories[activeTab].subjects.map((subject) => (
            <li
              key={subject.id}
              className="mb-4 p-4 border border-gray-300 rounded-md"
            >
              <h3 className="text-lg font-semibold">{subject.title}</h3>
              <p className="text-gray-700">{subject.details}</p>
              <p className="font-bold text-gray-900 mt-2">
                Price: {subject.price}
              </p>
              <Link to={`/subject/${subject.id}`}>
                <button className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300">
                  View Details
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CoursesPage;
