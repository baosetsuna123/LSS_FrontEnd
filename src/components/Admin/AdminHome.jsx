import SessionsChart from "./components/SessionsChart";
import SystemWalletBalance from "./components/SystemWalletBalance";
import TotalClasses from "./components/TotalClasses";
import TotalOrdersAmount from "./components/TotalOrdersAmount";
import TransactionHistory from "./components/TransactionHistory";
import UserCount from "./components/UserCount";
const AdminHome = () => {

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="flex items-start gap-14 ">
        <div className="">
          <div className="py-6">
            <TotalOrdersAmount />
          </div>
          <div className="py-6">
            <TotalClasses />
          </div>
        </div>
        <div className="min-w-[450px]">
          <div className="py-6">
            <UserCount />
          </div>
          <div className="py-6">
            <SystemWalletBalance />
          </div>
        </div>
      </div>
      <div>
        <SessionsChart />
      </div>
      <div className="py-6">
        <TransactionHistory />
      </div>
    </div>
  );
};

export default AdminHome;
