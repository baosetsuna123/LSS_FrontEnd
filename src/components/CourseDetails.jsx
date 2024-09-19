import { useParams } from "react-router-dom";

const SubjectDetailsPage = () => {
  const { subjectId } = useParams();

  const subjects = [
    {
      id: 1,
      title: "Algorithms",
      details: "Learn the basics of algorithms and data processing.",
      price: "$50",
    },
    {
      id: 2,
      title: "Data Structures",
      details: "Understand various data structures for better problem-solving.",
      price: "$60",
    },
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
  ];

  const subject = subjects.find((sub) => sub.id === parseInt(subjectId));

  if (!subject) {
    return <div>Subject not found!</div>;
  }

  return (
    <div className="w-full max-w-lg mx-auto my-10 p-6 bg-white border border-gray-200 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{subject.title}</h2>
      <p className="text-gray-700 mb-4">{subject.details}</p>
      <p className="font-bold text-gray-900 mb-4">Price: {subject.price}</p>
      <button className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300">
        Purchase
      </button>
    </div>
  );
};

export default SubjectDetailsPage;
