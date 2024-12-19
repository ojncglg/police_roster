import html2pdf from 'html2pdf.js';
import type { Roster } from '../types/roster';

export const exportToPDF = async (elementId: string, roster: Roster, month: Date) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const monthYear = month.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const filename = `${roster.name.replace(/\s+/g, '_')}_${monthYear}.pdf`;

  const opt = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a3', 
      orientation: 'landscape' as const
    },
    pagebreak: { mode: 'avoid-all' }
  };

  try {
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

export const generateMonthlyReport = (roster: Roster, month: Date) => {
  // Calculate statistics for the month
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const monthlyStats = {
    totalAssignments: 0,
    officerWorkload: {} as Record<string, number>,
    shiftDistribution: {} as Record<string, number>,
    positionCoverage: {} as Record<string, number>
  };

  // Filter assignments for the current month
  const monthlyAssignments = (roster.assignments || []).filter(assignment => {
    const assignmentDate = new Date(assignment.date);
    return assignmentDate >= startOfMonth && assignmentDate <= endOfMonth;
  });

  monthlyStats.totalAssignments = monthlyAssignments.length;

  // Calculate officer workload
  monthlyAssignments.forEach(assignment => {
    const officer = roster.officers.find(o => o.id === assignment.officerId);
    if (officer) {
      const officerId = officer.id;
      monthlyStats.officerWorkload[officerId] = 
        (monthlyStats.officerWorkload[officerId] || 0) + 1;
    }

    const shift = roster.shifts.find(s => s.id === assignment.shiftId);
    if (shift) {
      monthlyStats.shiftDistribution[shift.name] = 
        (monthlyStats.shiftDistribution[shift.name] || 0) + 1;
    }

    monthlyStats.positionCoverage[assignment.position] = 
      (monthlyStats.positionCoverage[assignment.position] || 0) + 1;
  });

  return monthlyStats;
};
