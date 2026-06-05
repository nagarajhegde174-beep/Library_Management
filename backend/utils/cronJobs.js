const cron = require("node-cron");
const { BorrowModel } = require("../model/BorrowModel");
const { UserModel }   = require("../model/UserModel");
const { FineConfigModel } = require("../model/FineConfigModel");
const calculateFine   = require("./fineCalculator");
const {
  sendEmail,
  overdueWarningTemplate,
  escalationWarningTemplate,
  accountExpiryWarningTemplate,
} = require("./emailService");


function startOverdueCronJob() {
  cron.schedule("0 0 * * *", async () => {
    console.log("[CRON] Running daily overdue check:", new Date().toLocaleString());

    try {
      const now = new Date();

      
      let config = await FineConfigModel.findOne();
      const ratePerDay  = config?.ratePerDay  || 10;
      const maxFineCap  = config?.maxFineCap  || 500;
      const gracePeriod = config?.gracePeriod || 0;

      const overdueBooks = await BorrowModel.find({
        status:  { $in: ["Issued", "Requested Return"] },
        dueDate: { $lt: now },
      }).populate("userId", "name email isRestricted").populate("bookId", "title");

      for (const borrow of overdueBooks) {
        const user = borrow.userId;
        if (!user || !user.email) continue;

        const overdueDays = Math.floor((now - new Date(borrow.dueDate)) / (1000 * 60 * 60 * 24));
        const fineAmount  = calculateFine(borrow.dueDate, null, ratePerDay, maxFineCap, gracePeriod);

        borrow.fineAmount = fineAmount;

        if (!user.isRestricted) {
          await UserModel.findByIdAndUpdate(user._id, {
            isRestricted:     true,
            restrictionReason: `Overdue book: "${borrow.bookId?.title || "Unknown"}"`,
          });
          console.log(`[CRON] Restricted user: ${user.name} (${user.email})`);
        }

        const lastSent = borrow.overduEmailSentAt;
        const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

        if (!lastSent || lastSent < oneDayAgo) {
          if (overdueDays >= 10) {
            const lastEsc = borrow.escalationEmailSentAt;
            const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000);

            if (!lastEsc || lastEsc < threeDaysAgo) {
              try {
                const tpl = escalationWarningTemplate({
                  userName:    user.name,
                  bookTitle:   borrow.bookId?.title || "Unknown",
                  dueDate:     borrow.dueDate,
                  overdueDays,
                  fineAmount,
                });
                await sendEmail(user.email, tpl.subject, tpl.html);
                borrow.escalationEmailSentAt = now;
                console.log(`[CRON] Escalation email sent to ${user.email} (${overdueDays} days overdue)`);
              } catch (e) {
                console.warn(`[CRON] Escalation email failed for ${user.email}:`, e.message);
              }
            }
          } else {
            try {
              const tpl = overdueWarningTemplate({
                userName:    user.name,
                bookTitle:   borrow.bookId?.title || "Unknown",
                dueDate:     borrow.dueDate,
                overdueDays,
                fineAmount,
              });
              await sendEmail(user.email, tpl.subject, tpl.html);
              borrow.overduEmailSentAt = now;
              console.log(`[CRON] Overdue email sent to ${user.email} (${overdueDays} days)`);
            } catch (e) {
              console.warn(`[CRON] Overdue email failed for ${user.email}:`, e.message);
            }
          }
        }

        await borrow.save();
      }

      const restrictedUsers = await UserModel.find({ isRestricted: true, role: "user" });
      for (const u of restrictedUsers) {
        const stillOverdue = await BorrowModel.countDocuments({
          userId: u._id,
          status: { $in: ["Issued", "Requested Return"] },
          dueDate: { $lt: now },
        });
        if (stillOverdue === 0) {
          await UserModel.findByIdAndUpdate(u._id, {
            isRestricted:     false,
            restrictionReason: "",
          });
          console.log(`[CRON] Lifted restriction for: ${u.name}`);
        }
      }

      console.log(`[CRON] Overdue check complete. Processed ${overdueBooks.length} overdue book(s).`);
    } catch (err) {
      console.error("[CRON] Overdue check FAILED:", err.message);
    }
  });

  console.log("[CRON] Daily overdue check scheduled (midnight)");
}


function startAccountExpiryCronJob() {
  cron.schedule("0 1 * * *", async () => {
    console.log("[CRON] Running account expiry check:", new Date().toLocaleString());

    try {
      const now = new Date();

      const expiredResult = await UserModel.updateMany(
        {
          role:           "user",
          accountExpired: false,
          accountEndDate: { $lt: now, $ne: null },
        },
        {
          $set: {
            accountExpired: true,
            status:         "Inactive",
          },
        }
      );
      console.log(`[CRON] Marked ${expiredResult.modifiedCount} account(s) as expired.`);

      const expiredUsers = await UserModel.find({
        role:           "user",
        accountExpired: true,
        accountEndDate: { $lt: now },
      });

      for (const u of expiredUsers) {
        await BorrowModel.updateMany(
          { userId: u._id, status: { $in: ["Issued", "Requested Return"] } },
          { $set: { forcedReturnPending: true } }
        );
      }

      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      const soonToExpire = await UserModel.find({
        role:           "user",
        accountExpired: false,
        status:         "Active",
        accountEndDate: { $gte: now, $lte: threeDaysFromNow },
      });

      for (const u of soonToExpire) {
        try {
          const tpl = accountExpiryWarningTemplate({ userName: u.name, endDate: u.accountEndDate });
          await sendEmail(u.email, tpl.subject, tpl.html);
          console.log(`[CRON] Expiry warning sent to: ${u.email}`);
        } catch (e) {
          console.warn(`[CRON] Expiry email failed for ${u.email}:`, e.message);
        }
      }

    } catch (err) {
      console.error("[CRON] Account expiry check FAILED:", err.message);
    }
  });

  console.log("[CRON] Account expiry check scheduled (1 AM daily)");
}

function startAllCronJobs() {
  startOverdueCronJob();
  startAccountExpiryCronJob();
  console.log("[CRON] All cron jobs started.");
}

module.exports = { startAllCronJobs };
