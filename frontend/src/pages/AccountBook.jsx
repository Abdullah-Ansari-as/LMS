import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { getPayment } from "../api/paymentApi";
import { 
  Loader2, 
  RefreshCw, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calendar, 
  Info, 
  User,
  ArrowUpRight,
  TrendingUp,
  History,
  X
} from "lucide-react";
import { CheckoutForm } from "../components/CheckoutForm";
import { stripePromise } from "../stripe";
import { motion, AnimatePresence } from "framer-motion";

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
      } else {
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
    }).format(amount);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Helper function to get status display
  const getStatusDisplay = (transaction) => {
    const status = transaction.paymentStatus || "pending";
    switch (status) {
      case "succeeded":
        return {
          text: "Paid",
          bgColor: "bg-green-50",
          textColor: "text-green-600",
          borderColor: "border-green-100",
          icon: <CheckCircle2 className="h-4 w-4" />,
          isActionable: false,
        };
      case "failed":
        return {
          text: "Failed",
          bgColor: "bg-red-50",
          textColor: "text-red-600",
          borderColor: "border-red-100",
          icon: <AlertCircle className="h-4 w-4" />,
          isActionable: true,
        };
      case "processing":
        return {
          text: "Processing",
          bgColor: "bg-blue-50",
          textColor: "text-blue-600",
          borderColor: "border-blue-100",
          icon: <RefreshCw className="h-4 w-4 animate-spin" />,
          isActionable: false,
        };
      default:
        return {
          text: "Pending",
          bgColor: "bg-amber-50",
          textColor: "text-amber-600",
          borderColor: "border-amber-100",
          icon: <Clock className="h-4 w-4" />,
          isActionable: true,
        };
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc] h-full min-h-[80vh]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600"/>
          <span className="text-slate-500 font-medium animate-pulse">Accessing financial records...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mt-20 bg-[#f8fafc] min-h-screen py-10 px-4 md:px-8 lg:px-12 font-sans">
      <AnimatePresence>
        {refreshing && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-3 font-bold text-sm border border-indigo-400"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating Ledger...
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Account Book</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage your semester dues and payments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
            <User className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Student</span>
            <span className="text-xs font-bold text-slate-900 mt-1">{user.name}</span>
          </div>
        </div>
      </motion.div>

      {/* Summary Statistics Card - Modern Design */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Invoiced", val: formatPKR(summary.totalAmount), icon: <TrendingUp />, color: "indigo" },
            { label: "Paid Amount", val: formatPKR(summary.paidAmount), icon: <CheckCircle2 />, color: "green", sub: `${summary.paidCount} payments` },
            { label: "Pending Dues", val: formatPKR(summary.pendingAmount), icon: <Clock />, color: "amber", sub: `${summary.pendingCount} unpaid` },
            { label: "History", val: summary.totalTransactions, icon: <History />, color: "slate", sub: "Total Vouchers" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className={`p-2 w-fit rounded-xl bg-${stat.color}-50 text-${stat.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
                {React.cloneElement(stat.icon, { size: 20 })}
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className={`text-xl font-black text-${stat.color}-700 tracking-tight`}>{stat.val}</h3>
              {stat.sub && <p className="text-[10px] font-bold text-slate-400 mt-2">{stat.sub}</p>}
            </motion.div>
          ))}
        </div>
      )}

      {/* Desktop Table View */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden hidden md:block"
      >
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-indigo-600" />
            Transaction Ledger
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing last {transactions.length} vouchers
          </span>
        </div>

        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-slate-50/80 text-slate-400">
              <th className="px-8 py-4 text-left text-[11px] font-black uppercase tracking-widest">Challan No</th>
              <th className="px-8 py-4 text-left text-[11px] font-black uppercase tracking-widest">Description</th>
              <th className="px-8 py-4 text-center text-[11px] font-black uppercase tracking-widest">Amount</th>
              <th className="px-8 py-4 text-center text-[11px] font-black uppercase tracking-widest">Due Date</th>
              <th className="px-8 py-4 text-center text-[11px] font-black uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions?.map((item, idx) => {
              const status = getStatusDisplay(item);

              return (
                <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 text-sm font-black text-slate-900">
                    {item.challanNo || `CH${idx + 1000}`}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{item.description || "Fee Payment"}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{item.paymentMethod || "Online"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                      {formatPKR(item.ammount || 0)}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-slate-600">
                        {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "-"}
                      </span>
                      <span className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">Valid Entry</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    {status.isActionable ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedTransaction(item);
                          setOpen(true);
                        }}
                      >
                        <CreditCard className="h-4 w-4" />
                        Pay Now
                      </motion.button>
                    ) : (
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${status.bgColor} ${status.textColor} ${status.borderColor} text-[10px] font-black uppercase tracking-widest shadow-sm`}>
                        {status.icon}
                        {status.text}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {transactions.length === 0 && (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <Info className="w-12 h-12 text-slate-200 mb-4" />
            <p className="text-slate-400 font-black text-lg uppercase tracking-widest">No Records Found</p>
            <p className="text-slate-300 text-sm mt-1">Your payment vouchers will be listed here.</p>
          </div>
        )}
      </motion.div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-6">
        {transactions?.map((item, idx) => {
          const status = getStatusDisplay(item);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Voucher #</span>
                  <h4 className="text-lg font-black text-slate-900 tracking-tight">{item.challanNo || `CH${idx + 1000}`}</h4>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${status.bgColor} ${status.textColor} text-[10px] font-black uppercase tracking-widest border border-current opacity-80`}>
                  {status.icon}
                  {status.text}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-400 uppercase text-[10px]">Description</span>
                  <span className="text-slate-900">{item.description || "Payment"}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-400 uppercase text-[10px]">Due Date</span>
                  <span className="text-slate-900">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "-"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Total Amount</span>
                  <span className="text-lg font-black text-indigo-600">{formatPKR(item.ammount || 0)}</span>
                </div>
              </div>

              {status.isActionable && (
                <button
                  className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
                  onClick={() => {
                    setSelectedTransaction(item);
                    setOpen(true);
                  }}
                >
                  <CreditCard className="h-4 w-4" />
                  Pay Now
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
};

export default AccountBook;

// Modern Payment Modal
const PaymentModal = ({ onClose, transaction, onPaymentSuccess }) => {
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
    setTimeout(() => {
      onClose();
      if (onPaymentSuccess) onPaymentSuccess();
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-[40px] p-8 w-full max-w-lg relative shadow-2xl border border-slate-200"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-50 rounded-2xl">
            <CreditCard className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {paymentCompleted ? "Payment Received" : "Secure Payment"}
            </h2>
            <p className="text-slate-500 text-sm font-medium">Safe & encrypted transaction</p>
          </div>
        </div>

        {paymentCompleted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Success!
            </p>
            <p className="text-slate-500 font-medium">
              Payment of <span className="text-indigo-600 font-bold">Rs. {transaction?.ammount}</span> confirmed.
            </p>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-8">Closing gateway...</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Challan</span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{transaction?.challanNo}</p>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{transaction?.description || "Tuition Fee"}</p>
                </div>
                <div className="col-span-2 pt-4 border-t border-slate-200 mt-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Payable</span>
                  <p className="text-2xl font-black text-indigo-600 mt-0.5">Rs. {transaction?.ammount}</p>
                </div>
              </div>
            </div>

            <div className="px-2">
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  amount={transaction?.ammount}
                  transactionId={transaction?._id}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            </div>
            
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              Powered by Stripe • No extra charges applied
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
