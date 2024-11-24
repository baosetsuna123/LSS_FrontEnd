import Deposit from "./components/Deposit";
import SessionsChart from "./components/SessionsChart";
import Slot from "./components/Slot";
import SystemWalletBalance from "./components/SystemWalletBalance";
import TotalClasses from "./components/TotalClasses";
import TotalCourses from "./components/TotalCourses";
import TotalOrdersAmount from "./components/TotalOrdersAmount";
import TransactionHistory from "./components/TransactionHistory";
import UserCount from "./components/UserCount";
const AdminHome = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div>
        <div className="grid grid-cols-4 gap-8 pb-8 *:min-h-[180px]">
          <TotalOrdersAmount />
          <TotalClasses />
          <UserCount />
          <SystemWalletBalance />
          <TotalCourses />
          {/* <Slot /> */}
        </div>
        <div className="flex flex-col gap-2">
          <SessionsChart />
          <TransactionHistory />
        </div>
        <div className="mx-auto py-8">
          <Deposit />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
