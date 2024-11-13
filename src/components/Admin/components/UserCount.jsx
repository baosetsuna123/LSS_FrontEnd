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
    <div className=" h-full w-full bg-green-500 *:text-white shadow-lg py-2 rounded-lg px-4">
       <h1 className="font-semibold text-xl pb-4 tracking-wider h-[40%]">Total members</h1>
      <div className="flex items-center gap-2 py-3">
        <div className="grid grid-cols-2  *:text-white gap-2 text-xl ">
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
