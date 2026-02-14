import React, { useEffect, useState } from "react";
import {
  FaCcStripe,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { getPayment, updatePaymentStatus } from "../api/paymentApi";
import { Loader2, RefreshCw } from "lucide-react";
import { CheckoutForm } from "../components/CheckoutForm";
import { toast } from "sonner"; // IMPORTANT: Add this import

const AccountBook = () => {
  const { user } = useSelector((store) => store.user);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch payments function
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await getPayment();

      if (response.success) {
        const fetchedTransactions =
          response.transactions || response.getPayment || [];
        setTransactions(fetchedTransactions);

        if (response.summary) {
          setSummary(response.summary);
        }

        console.log("Fetched transactions:", fetchedTransactions);
      } else {
        console.error("Failed to fetch payments:", response.message);
        setTransactions([]);
        setSummary({
          totalTransactions: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
        });
      }
    } catch (error) {
      console.error("Error in fetchPayments:", error);
      setTransactions([]);
      setSummary({
        totalTransactions: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh payments after successful payment
  const refreshPayments = async () => {
    setRefreshing(true);
    await fetchPayments();
    setRefreshing(false);
  };

  const formatPKR = (amount) => {
    return new Intl.NumberFormat("ur-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Helper function to get status icon and styling
  const getStatusDisplay = (transaction) => {
    if (transaction.statusDisplay) {
      return transaction.statusDisplay;
    }

    const status = transaction.paymentStatus || "pending";
    switch (status) {
      case "succeeded":
        return {
          text: "Paid",
          color: "#10b981",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          icon: <FaCheckCircle className="h-5 w-5 text-green-600" />,
          isActionable: false,
        };
      case "failed":
        return {
          text: "Failed",
          color: "#ef4444",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          icon: <FaTimesCircle className="h-5 w-5 text-red-600" />,
          isActionable: true,
        };
      case "processing":
        return {
          text: "Processing",
          color: "#3b82f6",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          icon: <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />,
          isActionable: false,
        };
      default:
        return {
          text: "Pending",
          color: "#f59e0b",
          bgColor: "bg-amber-100",
          textColor: "text-amber-800",
          icon: <FaClock className="h-5 w-5 text-amber-600" />,
          isActionable: true,
        };
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F2F3F8] h-full py-8 px-7">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-18 bg-[#F2F3F8] h-auto md:h-full py-8 px-2 md:px-7">
      {refreshing && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Updating payments...
        </div>
      )}

      <h1 className="text-2xl flex md:block items-center justify-center text-gray-800 mb-6">
        My Account Book
      </h1>

      {/* Summary Statistics Card */}
      {summary && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-blue-700">
              {summary.totalTransactions}
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-green-700">
              Rs. {summary.totalAmount}
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Paid Amount</p>
            <p className="text-2xl font-bold text-purple-700">
              Rs. {summary.paidAmount}
            </p>
            <p className="text-xs text-gray-500">
              {summary.paidCount} transactions
            </p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Pending Amount</p>
            <p className="text-2xl font-bold text-amber-700">
              Rs. {summary.pendingAmount}
            </p>
            <p className="text-xs text-gray-500">
              {summary.pendingCount} pending
            </p>
          </div>
        </div>
      )}

      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col gap-4 text-lg text-gray-600">
          <div>
            <span className="font-semibold">Name:</span> {user.name}
          </div>
          <div>
            <span className="font-semibold">Student Email:</span> {user.email}
          </div>
          {summary && (
            <div className="pt-4 border-t">
              <span className="font-semibold">Payment Summary:</span>{" "}
              {summary.paidCount} paid, {summary.pendingCount} pending,{" "}
              {summary.failedCount || 0} failed
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto hidden md:block">
        <table className="min-w-full table-auto text-sm text-left shadow">
          <thead className="bg-[#716ACA] text-white tracking-wider border-b">
            <tr>
              <th className="px-4 py-3 border border-gray-300 text-center">
                Challan No
              </th>
              <th className="px-4 py-3 border border-gray-300 text-center">
                Description
              </th>
              <th className="px-4 py-3 border border-gray-300 text-center">
                Amount (Rs.)
              </th>
              <th className="px-4 py-3 border border-gray-300 text-center">
                Due Date
              </th>
              <th className="px-4 py-3 border border-gray-300 text-center">
                Payment Method
              </th>
              <th className="px-4 py-3 border border-gray-300 text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions?.map((item, idx) => {
              const status = getStatusDisplay(item);

              return (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border border-gray-300 text-center">
                    {item.challanNo || `CH${idx + 1000}`}
                  </td>
                  <td className="px-4 py-3 border border-gray-300 text-center">
                    {item.description || "Payment"}
                  </td>
                  <td className="px-4 py-3 border border-gray-300 text-center">
                    Rs. {formatPKR(item.ammount) || 0}
                  </td>
                  <td className="px-4 py-3 border border-gray-300 text-center text-green-700">
                    {item.dueDate
                      ? new Date(item.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3 border border-gray-300 text-center font-semibold">
                    {item.paymentMethod || "Stripe"}
                  </td>
                  <td className="px-4 py-3 border border-gray-300 text-center">
                    {status.isActionable ? (
                      <button
                        className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#635bff] text-[#635bff] hover:bg-[#635bff] hover:text-white transition-colors"
                        onClick={() => {
                          setSelectedTransaction(item);
                          setOpen(true);
                        }}
                      >
                        <FaCcStripe className="h-5 w-5" />
                        <span className="font-medium">Pay Now</span>
                      </button>
                    ) : (
                      <div
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${status.bgColor} ${status.textColor} border`}
                      >
                        {status.icon}
                        <span className="font-medium">{status.text}</span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {/* Empty state */}
            {transactions.length === 0 && !loading && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  No transactions found. Your payments will appear here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {transactions?.map((item, idx) => {
          const status = getStatusDisplay(item);

          return (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-md space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Challan No:</span>
                <span>{item.challanNo || `CH${idx + 1000}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Description:</span>
                <span className="text-right">
                  {item.description || "Payment"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Amount (Rs.):</span>
                <span>Rs. {item.ammount || 0}</span>
              </div>
              <div className="flex justify-between text-sm text-green-700">
                <span className="font-medium text-gray-600">Due Date:</span>
                <span>
                  {item.dueDate
                    ? new Date(item.dueDate).toLocaleDateString()
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">
                  Payment Method:
                </span>
                <span className="font-semibold">
                  {item.paymentMethod || "Stripe"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t">
                <span className="font-medium text-gray-600">Status:</span>
                {status.isActionable ? (
                  <button
                    className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#635bff] text-[#635bff] hover:bg-[#635bff] hover:text-white transition-colors"
                    onClick={() => {
                      setSelectedTransaction(item);
                      setOpen(true);
                    }}
                  >
                    <FaCcStripe className="h-4 w-4" />
                    <span className="font-medium">Pay Now</span>
                  </button>
                ) : (
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${status.bgColor} ${status.textColor} border`}
                  >
                    {status.icon}
                    <span className="font-medium">{status.text}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty state for mobile */}
        {transactions.length === 0 && !loading && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-2">No transactions found</p>
            <p className="text-sm text-gray-400">
              Your payments will appear here once available.
            </p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {open && selectedTransaction && (
        <PaymentModal
          transaction={selectedTransaction}
          onClose={() => {
            setOpen(false);
            setSelectedTransaction(null);
            refreshPayments();
          }}
          onPaymentSuccess={refreshPayments}
        />
      )}
    </div>
  );
};

export default AccountBook;

// Payment Modal Component
const PaymentModal = ({ onClose, transaction, onPaymentSuccess }) => {
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
    setTimeout(() => {
      onClose();
      if (onPaymentSuccess) onPaymentSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {paymentCompleted ? "Payment Successful!" : "Complete Payment"}
        </h2>

        {paymentCompleted ? (
          <div className="text-center py-4">
            <FaCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Payment Successful!
            </p>
            <p className="text-gray-600">
              Your payment of{" "}
              <span className="font-bold">
                {new Intl.NumberFormat("ur-PK", {
                  style: "currency",
                  currency: "PKR",
                }).format(transaction?.ammount)}
              </span>{" "}
              has been processed.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="mb-2">
                <strong>Challan No:</strong> {transaction?.challanNo}
              </p>
              <p className="mb-2">
                <strong>Description:</strong> {transaction?.description}
              </p>
              <p className="text-lg font-semibold">
                <strong>Amount:</strong> Rs. {transaction?.ammount}
              </p>
            </div>

            <CheckoutForm
              amount={transaction?.ammount}
              transactionId={transaction?._id || transaction?.challanNo}
              onSuccess={handlePaymentSuccess}
            />
          </>
        )}
      </div>
    </div>
  );
};