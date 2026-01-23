import React, { useEffect, useState } from "react";
import { FaCcStripe } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getPayment } from "../api/paymentApi";
import { Loader2 } from "lucide-react";


const AccountBook = () => {

  const { user } = useSelector((store) => store.user);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const getPayments = async () => {
        setLoading(true)
        const res = await getPayment();
        if (res.success) {
          setLoading(false)
          setTransactions(res.getPayment);
        }
      }
      getPayments();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, [])

  if (loading) {
    return <div className="flex-1 flex items-center justify-center bg-[#F2F3F8] h-full py-8 px-7">
      <div><Loader2 className="h-10 w-10 animate-spin" /></div>
    </div>
  }

  return (
    <div className="mt-18 bg-[#F2F3F8] h-auto md:h-full py-8 px-2 md:px-7">
      <h1 className="text-2xl flex md:block items-center justify-center text-gray-800 mb-6">My Account Book</h1>

      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col gap-4 text-lg text-gray-600">
          <div>
            <span className="font-semibold">Name:</span> {user.name}
          </div>
          <div>
            <span className="font-semibold">Student Email:</span> {user.email}
          </div>
        </div>
      </div>

      {/* md or above screens */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto hidden md:block">
        <table className="min-w-full table-auto text-sm text-left shadow">
          <thead className="bg-[#716ACA] text-white tracking-wider border-b">
            <tr>
              <th className="px-4 py-3 border border-gray-300 text-center">Challan No</th>
              <th className="px-4 py-3 border border-gray-300 text-center">Description</th>
              <th className="px-4 py-3 border border-gray-300 text-center">Ammount (Rs.)</th>
              <th className="px-4 py-3 border border-gray-300 text-center">Due Date</th>
              <th className="px-4 py-3 border border-gray-300 text-center">Payment Method</th>
              <th className="px-4 py-3 border border-gray-300 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions?.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 border border-gray-300 text-center">{item.challanNo}</td>
                <td className="px-4 py-3 border border-gray-300 text-center">{item.description}</td>
                <td className="px-4 py-3 border border-gray-300 text-center">{item.ammount}</td>
                <td className="px-4 py-3 border border-gray-300 text-center text-green-700">{item.dueDate || "-"}</td>
                <td className="px-4 py-3 border border-gray-300 text-center font-semibold">Stripe</td>
                <td className="px-4 py-3 border border-gray-300 text-center font-semibold">
                  <button className="cursor-pointer">
                    <FaCcStripe className="h-7 w-7 hover:w-8 hover:h-8 duration-400 hover:text-gray-700 transition-transform hover:scale-110 ease-in-out" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {/* small screens only */}
      <div className="block md:hidden space-y-4">
        {transactions?.map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-md space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">Challan No:</span>
              <span>{item.challanNo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">Description:</span>
              <span className="text-right">{item.description}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">Amount (Rs.):</span>
              <span>{item.ammount}</span>
            </div>
            <div className="flex justify-between text-sm text-green-700">
              <span className="font-medium text-gray-600">Due Date:</span>
              <span>{item.dueDate || "-"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">Payment Method:</span>
              <span className="font-semibold">Stripe</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-600">Status:</span>
              <button className="cursor-pointer">
                <FaCcStripe className="h-7 w-7 hover:w-8 hover:h-8 duration-400 hover:text-gray-700 transition-transform hover:scale-110 ease-in-out" />
              </button>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default AccountBook;
