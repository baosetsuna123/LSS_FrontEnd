import { getTotalClasses } from "@/data/api";
import { useEffect, useState } from "react"

export default function TotalClasses() {
  const [totalClasses, setTotalClasses] = useState(0)
  const result = localStorage.getItem("result");
  let token;
  if (result) {
      try {
          const parsedResult = JSON.parse(result);
          token = parsedResult.token;
      } catch (error) {
          console.error("Error parsing result from localStorage:", error);
      }
  }
  const getClasses = async () => {
    try {
      const res = await getTotalClasses(token);
      setTotalClasses(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getClasses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="flex flex-col justify-center items-center w-full bg-white shadow-lg py-3 rounded-lg px-4">
      <h1 className="font-semibold text-xl py-5 tracking-wider uppercase text-center">Total Classes</h1>
      <div className="*:text-blue-800 gap-6 text-2xl font-semibold" >
        <span>{totalClasses}</span>
      </div>
    </div>
  )
}
