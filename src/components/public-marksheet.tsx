import type { Lang } from "@/lib/types";

export interface PublicSubjectMark {
  name: string;
  nameBn?: string;
  cq?: number;
  mcq?: number;
  practical?: number;
  attendance?: number;
  obtained: number;
  full: number;
  letter: string;
  gpa: number;
}

export interface PublicResultCard {
  student: {
    name: string;
    nameBn?: string;
    studentId: string;
    rollNo?: string;
    section?: string;
    group?: string;
    academicYear?: string;
    className?: string;
    fatherName?: string;
    motherName?: string;
  };
  exam: { name: string; academicYear?: string };
  gpa: number;
  letter: string;
  totalObtained?: number;
  totalFull?: number;
  academicYear?: string;
  meritPosition?: number | null;
  subjects: PublicSubjectMark[];
}

export interface MarksheetSchool {
  name: string;
  logoUrl: string;
  motto: string;
  address: string;
  eiin: string;
  establishedYear: number | null;
  academicYear: string;
}

const GPA_BANDS = [
  { range: "80–100", grade: "A+", gpa: "5.00" },
  { range: "70–79", grade: "A", gpa: "4.00" },
  { range: "60–69", grade: "A−", gpa: "3.50" },
  { range: "50–59", grade: "B", gpa: "3.00" },
  { range: "40–49", grade: "C", gpa: "2.00" },
  { range: "33–39", grade: "D", gpa: "1.00" },
  { range: "0–32", grade: "F", gpa: "0.00" },
];

const COPY = {
  bn: {
    transcript: "নম্বরপত্র",
    eiin: "ইআইআইএন",
    name: "নাম",
    className: "শ্রেণি",
    roll: "রোল",
    id: "আইডি",
    section: "শাখা",
    group: "গ্রুপ",
    father: "পিতার নাম",
    mother: "মাতার নাম",
    year: "শিক্ষাবর্ষ",
    position: "মেধাক্রম",
    sl: "ক্রমিক",
    subject: "বিষয়",
    full: "পূর্ণ নম্বর",
    cq: "সৃজনশীল",
    mcq: "নৈর্ব্যক্তিক",
    practical: "ব্যবহারিক",
    attendance: "উপস্থিতি নম্বর",
    obtained: "প্রাপ্ত নম্বর",
    grade: "গ্রেড",
    gpa: "জিপিএ",
    total: "মোট",
    remarks: "মন্তব্য",
    pass: "কৃতকার্য",
    fail: "অকৃতকার্য",
    scale: "গ্রেডিং স্কেল (জিপিএ ৫.০০)",
    seal: "সিল",
    issued: "প্রদানের তারিখ",
  },
  en: {
    transcript: "Marksheet",
    eiin: "EIIN",
    name: "Name",
    className: "Class",
    roll: "Roll",
    id: "ID",
    section: "Section",
    group: "Group",
    father: "Father's name",
    mother: "Mother's name",
    year: "Year",
    position: "Merit position",
    sl: "SL",
    subject: "Subject",
    full: "Full marks",
    cq: "Creative",
    mcq: "MCQ",
    practical: "Practical",
    attendance: "Attendance marks",
    obtained: "Marks obtained",
    grade: "Grade",
    gpa: "GPA",
    total: "Total",
    remarks: "Remarks",
    pass: "Passed",
    fail: "Failed",
    scale: "Grading scale (GPA 5.00)",
    seal: "Seal",
    issued: "Date of issue",
  },
} as const;

function dash(value?: string | number | null): string {
  if (value === 0) return "0";
  if (value == null || value === "") return "—";
  return String(value);
}

function points(value?: number): string {
  if (value == null || Number.isNaN(value)) return "—";
  return value.toFixed(2);
}

export function PublicMarksheet({
  row,
  school,
  lang,
}: {
  row: PublicResultCard;
  school: MarksheetSchool;
  lang: Lang;
}) {
  const t = COPY[lang];
  const student = row.student;
  const subjects = row.subjects ?? [];
  const failed = row.letter === "F" || subjects.some((item) => item.letter === "F");
  const issued = new Date().toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB");
  const schoolName = school.name?.trim() || "School";
  const logoUrl = school.logoUrl?.trim() || "";
  const showAttendance = subjects.some((item) => (item.attendance ?? 0) > 0);
  const showPractical = subjects.some((item) => (item.practical ?? 0) > 0);
  const displayName = student.nameBn || student.name;
  const span = 2 + (showPractical ? 1 : 0) + (showAttendance ? 1 : 0);

  return (
    <article className="marksheet-sheet">
      <div className="certificate-frame">
        <div className="certificate-inner">
          <span className="certificate-corner certificate-corner-tl" aria-hidden />
          <span className="certificate-corner certificate-corner-tr" aria-hidden />
          <span className="certificate-corner certificate-corner-bl" aria-hidden />
          <span className="certificate-corner certificate-corner-br" aria-hidden />

          <div className="certificate-watermark" aria-hidden>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" />
            ) : (
              <span>{schoolName.slice(0, 1).toUpperCase()}</span>
            )}
          </div>

          <div className="marksheet-body">
            <header className="marksheet-head">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="" className="certificate-crest" />
              ) : (
                <div className="certificate-crest certificate-crest-letter">{schoolName.slice(0, 1).toUpperCase()}</div>
              )}
              <h2>{schoolName}</h2>
              {school.address ? <p>{school.address}</p> : null}
              <p className="marksheet-meta">
                {school.eiin ? `${t.eiin}: ${school.eiin}` : null}
                {school.establishedYear ? `${school.eiin ? " · " : ""}Est. ${school.establishedYear}` : null}
              </p>
              {school.motto ? <p className="marksheet-motto">&ldquo;{school.motto}&rdquo;</p> : null}
              <p className="marksheet-title">{t.transcript}</p>
              <p className="marksheet-meta">
                Academic Transcript · {row.exam.name} · {row.exam.academicYear || row.academicYear || school.academicYear}
              </p>
            </header>

            <dl className="marksheet-facts">
              <Info label={t.name} value={displayName} />
              {student.nameBn && student.name && student.nameBn !== student.name ? (
                <Info label={`${t.name} (EN)`} value={student.name} />
              ) : null}
              <Info label={t.className} value={student.className} />
              <Info label={t.roll} value={student.rollNo} />
              <Info label={t.id} value={student.studentId} />
              <Info label={t.section} value={student.section} />
              <Info label={t.group} value={student.group && student.group !== "None" ? student.group : "—"} />
              <Info label={t.father} value={student.fatherName} />
              <Info label={t.mother} value={student.motherName} />
              <Info label={t.year} value={student.academicYear || row.academicYear} />
              <Info label={t.position} value={row.meritPosition ? String(row.meritPosition) : "—"} />
            </dl>

            <div className="marksheet-table-wrap">
              <table className="marksheet-table">
                <thead>
                  <tr>
                    <th>{t.sl}</th>
                    <th className="is-left">{t.subject}</th>
                    <th>{t.full}</th>
                    <th>{t.cq}</th>
                    <th>{t.mcq}</th>
                    {showPractical ? <th>{t.practical}</th> : null}
                    {showAttendance ? <th>{t.attendance}</th> : null}
                    <th>{t.obtained}</th>
                    <th>{t.grade}</th>
                    <th>{t.gpa}</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((item, index) => (
                    <tr key={`${item.name}-${index}`}>
                      <td>{index + 1}</td>
                      <td className="is-left">{item.name || item.nameBn || "—"}</td>
                      <td>{dash(item.full)}</td>
                      <td>{dash(item.cq)}</td>
                      <td>{dash(item.mcq)}</td>
                      {showPractical ? <td>{item.practical != null ? item.practical : "—"}</td> : null}
                      {showAttendance ? <td>{item.attendance != null ? item.attendance : "—"}</td> : null}
                      <td className="is-strong">{dash(item.obtained)}</td>
                      <td>{dash(item.letter)}</td>
                      <td>{points(item.gpa)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2}>{t.total}</td>
                    <td>{dash(row.totalFull)}</td>
                    <td colSpan={span} />
                    <td>{dash(row.totalObtained)}</td>
                    <td>{dash(row.letter)}</td>
                    <td>{points(row.gpa)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="marksheet-summary">
              <div>
                <p><span>{t.gpa}: </span><strong>{points(row.gpa)}</strong></p>
                <p><span>{t.grade}: </span><strong>{row.letter}</strong></p>
                <p><span>{t.remarks}: </span><strong>{failed ? t.fail : t.pass}</strong></p>
              </div>
              <div className="certificate-seal">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="" />
                ) : null}
                <span>{t.seal}</span>
              </div>
            </div>

            <div className="marksheet-scale">
              <p>{t.scale}</p>
              <table>
                <thead>
                  <tr>
                    <th>{t.obtained}</th>
                    {GPA_BANDS.map((band) => (
                      <th key={band.grade}>{band.range}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{t.grade}</td>
                    {GPA_BANDS.map((band) => (
                      <td key={band.grade}>{band.grade}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>{t.gpa}</td>
                    {GPA_BANDS.map((band) => (
                      <td key={`g-${band.grade}`}>{band.gpa}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="marksheet-issued">{t.issued}: {issued}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{dash(value)}</dd>
    </div>
  );
}
