const { Schema } = require("mongoose");

const BorrowSchema = new Schema(
  {
    bookId:     { type: Schema.Types.ObjectId, ref: "Book", required: true },
    userId:     { type: Schema.Types.ObjectId, ref: "User", required: true },
    issueDate:  { type: Date, default: Date.now },
    dueDate:    { type: Date, required: true },
    returnDate: { type: Date, default: null },
    fineAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Requested", "Issued", "Rejected", "Requested Return", "Returned", "borrow_rejected", "return_rejected", "renewal_rejected"],
      default: "Requested",
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },

    rejectedBy:      { type: Schema.Types.ObjectId, ref: "User", default: null },
    rejectionReason: { type: String, default: "" },

    overduEmailSentAt:     { type: Date, default: null },  
    escalationEmailSentAt: { type: Date, default: null },  

    forcedReturnPending: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = { BorrowSchema };
