const { BookModel } = require("../model/BookModel");
const { BorrowModel } = require("../model/BorrowModel");

const homeController = {};

homeController.getHomeData = async (req, res) => {
  try {
    
    const totalBooks = await BookModel.countDocuments({});
    const categories = await BookModel.distinct("category", {
      category: { $ne: null },
    });
    const totalCategories = categories.length;

   
    const issuedCount = await BorrowModel.countDocuments({ status: "Issued" });
    const borrowedCount = await BorrowModel.countDocuments({
      status: { $in: ["Issued", "Requested Return"] },
    });
    const borrowerIds = await BorrowModel.distinct("userId", {
      status: "Issued",
    });
    const totalBorrowers = borrowerIds.length;

    const copyStats = await BookModel.aggregate([
      { $group: { _id: null, totalCopies: { $sum: "$totalCopies" } } },
    ]);
    const totalCopies = copyStats[0]?.totalCopies || 0;

    const books = await BookModel.find({})
      .sort({ createdAt: -1 })
      .select("title author category coverImage price");

    return res.status(200).json({
      error: false,
      message: "Home data",
      books,
      totalBooks,
      totalCategories,
      totalActiveStudents: totalBorrowers, 
      booksCount: totalBooks,
      categoriesCount: totalCategories,
      borrowersCount: totalBorrowers,
      issuedCount,
      borrowedCount,
      totalCopies,
    });
  } catch (err) {
    console.error("HOME STATS ERROR:", err);
    return res.status(500).json({
      error: true,
      message: "Failed to compute home stats",
      details: err.message,
      books: [],
      totalBooks: 0,
      totalCategories: 0,
      totalActiveStudents: 0,
      booksCount: 0,
      categoriesCount: 0,
      borrowersCount: 0,
      issuedCount: 0,
      borrowedCount: 0,
      totalCopies: 0,
    });
  }
};

module.exports = { homeController };
