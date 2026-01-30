db.admins.updateOne(
    { email: "superadmin@englishom.com" },
    { $set: { password: "$2b$10$LfyEEO3FW8wTcgCBmCNkHuuMrotm.lkPzhPE0bI2t1jXS.cdwM/wa" } }
);
print("Password updated successfully");
