import React, { useState } from "react";
import { uploadPayment } from "../../api/paymentApi";
import { toast } from "sonner";

const PaymentForm = () => {
 
	const [dueDate, setDueDate] = useState("");
	const [ammount, setammount] = useState("");
	const [description, setDescription] = useState("");
	const [challanNo, setChallanNo] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		const paymentData = {
			dueDate,
			ammount,
			description,
			challanNo, 
		};

		try {
			const res = await uploadPayment(paymentData); 
			if(res.success) {
				toast.success(res.message);
				// Clear the form
				setDueDate("");
				setammount("");
				setDescription("");
				setChallanNo("");
			}
		} catch (error) {
			console.error(error);
		}

	};

	return (
		<div className="p-6 min-h-screen bg-[#F2F3F8] mt-0 md:pt-10 px-3 md:px-7">
			<h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Details</h2>
			<div className="max-w-xl mx-auto bg-[#F8F8F8] p-3 md:p-6 rounded-lg shadow">
				<h2 className="text-2xl font-bold mb-4">Add Payment Details</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Due Date */}
					<div className="form-control">
						<label className="label font-medium pr-2">Due Date</label>
						<input
							type="date"
							className="input input-bordered"
							value={dueDate}
							onChange={(e) => setDueDate(e.target.value)}
							required
						/>
					</div>

					{/* ammount */}
					<div className="form-control">
						<label className="label font-medium pr-2">ammount (Rs.)</label>
						<input
							type="number"
							className="input input-bordered"
							value={ammount}
							onChange={(e) => setammount(e.target.value)}
							placeholder="Enter ammount"
							required
						/>
					</div>

					{/* Description */}
					<div className="form-control">
						<label className="label font-medium pr-2">Description</label>
						<textarea
							className="textarea textarea-bordered"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="e.g. Semester Fee, Library Charges, etc."
							required
						/>
					</div>

					{/* Challan No */}
					<div className="form-control">
						<label className="label font-medium pr-2">Challan No.</label>
						<input
							type="text"
							className="input input-bordered"
							value={challanNo}
							maxLength={6}
							onChange={(e) => setChallanNo(e.target.value)}
							placeholder="e.g. 000000"
							required
						/>
					</div>

					<button disabled={!dueDate || !ammount || !description || !challanNo} className="btn btn-primary w-full mt-3" type="submit">
						Submit Payment
					</button>
				</form>
			</div>
		</div>
	);
};

export default PaymentForm;
