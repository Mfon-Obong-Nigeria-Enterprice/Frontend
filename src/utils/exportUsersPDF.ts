import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { CompanyUser } from "@/stores/useUserStore";

export const exportUsersPDF = (users: CompanyUser[]) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text("User Report", 14, 20);

  // Convert users to rows
  const tableData = users.map((u) => [
    u.name,
    u.email,
    u.role,
    new Date(u.createdAt).toLocaleDateString(),
  ]);

  autoTable(doc, {
    head: [["Name", "Email", "Role", "Created"]],
    body: tableData,
    startY: 30,
  });

  // Download PDF
  doc.save("user-report.pdf");
};
