import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, X, ShieldCheck, Undo2 } from 'lucide-react';
import { AppealCase, CaseCompletionReason } from '../types/appeal';
import { formatThaiDate, getTodayString } from '../utils/dateUtils';

interface CompleteModalProps {
  isOpen: boolean;
  caseItem: AppealCase | null;
  onClose: () => void;
  onConfirmComplete: (
    caseId: string,
    reason: CaseCompletionReason,
    completedDate: string,
    notes?: string
  ) => void;
  onReopenCase?: (caseId: string) => void;
}

export const CompleteModal: React.FC<CompleteModalProps> = ({
  isOpen,
  caseItem,
  onClose,
  onConfirmComplete,
  onReopenCase,
}) => {
  const [reason, setReason] = useState<CaseCompletionReason>('appealed');
  const [completedDate, setCompletedDate] = useState<string>(getTodayString());
  const [notes, setNotes] = useState('');

  if (!isOpen || !caseItem) return null;

  const isAlreadyCompleted = caseItem.isCompleted;

  const handleConfirm = () => {
    onConfirmComplete(caseItem.id, reason, completedDate, notes);
    onClose();
  };

  const handleReopen = () => {
    if (onReopenCase) {
      onReopenCase(caseItem.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className={`px-6 py-4 text-white flex items-center justify-between ${isAlreadyCompleted ? 'bg-slate-800' : 'bg-emerald-700'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-['Prompt']">
                {isAlreadyCompleted ? 'จัดการสถานะเสร็จสิ้นสำนวน' : 'ยืนยันการกดเสร็จสิ้นสำนวนคดี'}
              </h3>
              <p className="text-xs text-white/80">
                {isAlreadyCompleted ? 'สำนวนนี้เสร็จสิ้นแล้ว ไม่มีการแจ้งเตือน' : 'เมื่อกดเสร็จสิ้นแล้ว สำนวนนี้จะไม่แจ้งเตือนอีกต่อไป'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Case Info Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 font-['Prompt'] text-sm">
                ดำ {caseItem.blackCaseNo} / แดง {caseItem.redCaseNo}
              </span>
              <span className="text-slate-500">{caseItem.court}</span>
            </div>
            <div className="text-slate-600">
              <span className="text-slate-500">โจทก์:</span> {caseItem.plaintiff} | <span className="text-slate-500">จำเลย:</span> {caseItem.defendant}
            </div>
            <div className="text-slate-600">
              <span className="text-slate-500">วันพิพากษา:</span> {formatThaiDate(caseItem.judgmentDate)}
            </div>
            <div className="text-rose-700 font-semibold">
              <span>วันครบกำหนดอุทธรณ์ 1 เดือน:</span> {formatThaiDate(caseItem.extendedDeadline || caseItem.appealDeadline)}
            </div>
          </div>

          {!isAlreadyCompleted ? (
            <div className="space-y-3.5">
              {/* Reason Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  ผลการดำเนินการ / เหตุผลที่เสร็จสิ้น *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as CaseCompletionReason)}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="appealed">ยื่นอุทธรณ์ต่อศาลเรียบร้อยแล้ว</option>
                  <option value="no_appeal">มีคำสั่งไม่อุทธรณ์ / ยุติการดำเนินคดี</option>
                  <option value="finalized">คดีถึงที่สุดตามคำพิพากษาศาลชั้นต้น</option>
                  <option value="settled">คู่ความตกลงยอมความหรือชำระหนี้ครบถ้วนแล้ว</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>

              {/* Completed Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  วันที่ดำเนินการเสร็จสิ้น *
                </label>
                <input
                  type="date"
                  value={completedDate}
                  onChange={(e) => setCompletedDate(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  บันทึกข้อความ / รายละเอียดการยื่น
                </label>
                <textarea
                  rows={2}
                  placeholder="เช่น ยื่นอุทธรณ์ต่อศาลอาญาแล้ว มีใบเสร็จรับเงินค่าธรรมเนียม เลขที่..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Safety notice */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">ผลกระทบของการกดเสร็จสิ้น:</strong>
                  <p className="text-[11px] mt-0.5 text-emerald-700">
                    สำนวนนี้จะถูกทำเครื่องหมายว่า "เสร็จสิ้นแล้ว" และ<strong>ระบบจะไม่นำมาส่งการแจ้งเตือนเตือนภัยอีกต่อไป</strong> เพื่อป้องกันความสับสน โดยข้อมูลจะถูกอัปเดตลง Google Sheets ของท่านด้วย
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-slate-100 rounded-xl p-4 text-xs text-slate-700 space-y-1">
                <div>
                  <span className="font-semibold">สถานะปัจจุบัน:</span> เสร็จสิ้นแล้ว
                </div>
                <div>
                  <span className="font-semibold">วันที่เสร็จสิ้น:</span> {formatThaiDate(caseItem.completedDate)}
                </div>
                {caseItem.notes && (
                  <div>
                    <span className="font-semibold">บันทึก:</span> {caseItem.notes}
                  </div>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  หากต้องการนำสำนวนนี้กลับมาติดตามคุมอุทธรณ์และแจ้งเตือนต่อ สามารถกด "เปิดสำนวนใหม่" ได้
                </span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              ปิด
            </button>

            {isAlreadyCompleted ? (
              <button
                type="button"
                onClick={handleReopen}
                className="px-4 py-2 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-xl transition flex items-center gap-1.5"
              >
                <Undo2 className="w-4 h-4" />
                <span>เปิดสำนวนใหม่ (เริ่มแจ้งเตือนอีกครั้ง)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirm}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ยืนยันเสร็จสิ้น (หยุดแจ้งเตือน)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
