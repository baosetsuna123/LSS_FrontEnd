import { getUserCountByRole } from "@/data/api"
import { useEffect, useState } from "react";

export default function UserCount() {
  const [members, setMembers] = useState();
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

  const getUserCount = async () => {
    try {
      const res = await getUserCountByRole(token)
      setMembers(res)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getUserCount()
  }, [token])

  return (
    <div className="flex flex-col justify-center items-center w-full bg-white shadow-lg py-10 rounded-lg px-8">
      <h1 className="font-semibold text-xl pb-4 tracking-wider uppercase text-center">Total members</h1>
      <div className="flex items-center gap-2 py-3">
        <div className="grid grid-cols-2 items-center  *:text-blue-800 gap-6 text-2xl ">
          <div >
            <span className="font-semibold">Admin:</span> <span>{members?.ADMIN | 0}</span>
          </div>
          <div >
            <span className="font-semibold">Staff:</span> <span>{members?.STAFF | 0}</span>
          </div>
          <div >
            <span className="font-semibold">Teacher:</span> <span>{members?.TEACHER | 0}</span>
          </div>
          <div >
            <span className="font-semibold">Student:</span> <span>{members?.STUDENT | 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
