import { useState } from "react";

function QualificationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    highestDegree: "",
    university: "",
    graduationYear: "",
    specialization: "",
    teachingExperience: "",
    certifications: "",
    languages: "",
    additionalSkills: "",
    resumeLink: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Đơn đăng ký trình độ giảng dạy
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block mb-2 text-gray-700">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-2 text-gray-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="highestDegree" className="block mb-2 text-gray-700">
              Bằng cấp cao nhất <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="highestDegree"
              name="highestDegree"
              value={formData.highestDegree}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="university" className="block mb-2 text-gray-700">
              Trường đại học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="university"
              name="university"
              value={formData.university}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="graduationYear"
              className="block mb-2 text-gray-700"
            >
              Năm tốt nghiệp <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="graduationYear"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="specialization"
              className="block mb-2 text-gray-700"
            >
              Chuyên ngành <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="teachingExperience"
              className="block mb-2 text-gray-700"
            >
              Kinh nghiệm giảng dạy (năm){" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="teachingExperience"
              name="teachingExperience"
              value={formData.teachingExperience}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="certifications" className="block mb-2 text-gray-700">
            Chứng chỉ (nếu có)
          </label>
          <textarea
            id="certifications"
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          ></textarea>
        </div>
        <div>
          <label htmlFor="languages" className="block mb-2 text-gray-700">
            Ngôn ngữ giảng dạy <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="languages"
            name="languages"
            value={formData.languages}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="additionalSkills"
            className="block mb-2 text-gray-700"
          >
            Kỹ năng bổ sung
          </label>
          <textarea
            id="additionalSkills"
            name="additionalSkills"
            value={formData.additionalSkills}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          ></textarea>
        </div>
        <div>
          <label htmlFor="resumeLink" className="block mb-2 text-gray-700">
            Link CV (nếu có)
          </label>
          <input
            type="url"
            id="resumeLink"
            name="resumeLink"
            value={formData.resumeLink}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-900 text-white font-semibold px-4 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          Gửi đơn
        </button>
      </form>

      {formSubmitted && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          Đơn của bạn đã được gửi thành công! Chúng tôi sẽ xem xét và liên hệ
          lại với bạn sớm.
        </div>
      )}
    </div>
  );
}

export default QualificationForm;
