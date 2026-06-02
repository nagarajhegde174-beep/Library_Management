const { Schema } = require("mongoose");

function generateMembershipId() {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,"0")}${String(date.getDate()).padStart(2,"0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `LIB-${ymd}-${rand}`;
}

const UserSchema = new Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  role:         { type: String, enum: ["admin","librarian","user"], default: "user" },
  status:       { type: String, enum: ["Active","Inactive"], default: "Active" },
  membershipId: { type: String, unique: true, sparse: true },
  stream:       { type: String, required: function(){ return this.role === "user"; } },
  year:         { type: Number, required: function(){ return this.role === "user"; } },
  profilePicture: { type: String, default: "" },
  cloudinaryId:   { type: String, default: "" },

  accountStartDate: { type: Date, default: null },   
  accountEndDate:   { type: Date, default: null },   
  accountExpired:   { type: Boolean, default: false },

  isRestricted:     { type: Boolean, default: false },
  restrictionReason:{ type: String,  default: "" },   

  lastOverdueEmailAt:    { type: Date, default: null },
  lastEscalationEmailAt: { type: Date, default: null },

}, { timestamps: true });

UserSchema.pre("save", async function() {
  if (this.role === "user" && !this.membershipId) {
    this.membershipId = generateMembershipId();
  }
});

module.exports = { UserSchema };
