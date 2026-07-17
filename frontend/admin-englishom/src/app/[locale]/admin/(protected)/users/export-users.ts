import { formatDate } from '@/lib/utils';
import { User } from '@/types/admins.types';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export async function exportUsersToExcel(users: User[], filename?: string) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Users');

  worksheet.columns = [
    { header: 'Full Name', key: 'fullName', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Occupation / Profession', key: 'occupation', width: 25 },
    { header: 'Country', key: 'country', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Is Verified', key: 'isVerified', width: 15 },
    { header: 'Last Activity', key: 'lastActivity', width: 20 },
  ];

  users.forEach((user) => {
    worksheet.addRow({
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      occupation: user.occupation || 'Student',
      country: user.country || '-',
      status: user.status,
      isVerified: user.isVerified ? 'Yes' : 'No',
      lastActivity: formatDate(user.lastActivity),
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const date = new Date().toISOString().split('T')[0];
  const defaultFilename = `users_${date}.xlsx`;

  saveAs(new Blob([buffer]), filename || defaultFilename);
}
