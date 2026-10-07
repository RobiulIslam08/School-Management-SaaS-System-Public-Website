import type { Lang } from "@/lib/types";

export interface SlipAddress {
  holding?: string;
  area?: string;
  upazila?: string;
  postOffice?: string;
  district?: string;
}

export interface SlipData {
  studentId?: string;
  name: string;
  nameBn?: string;
  phone?: string;
  email?: string;
  dob?: string;
  birthRegNo?: string;
  religion?: string;
  bloodGroup?: string;
  photoUrl?: string;
  courseName?: string;
  fatherName?: string;
  fatherNameBn?: string;
  fatherPhone?: string;
  motherName?: string;
  motherNameBn?: string;
  motherPhone?: string;
  address?: SlipAddress;
  permanentAddress?: SlipAddress;
}

export interface SlipSchool {
  name: string;
  logoUrl: string;
  motto: string;
  address: string;
  eiin: string;
  establishedYear: number | null;
  academicYear: string;
  accent: string;
}

const COPY = {
  bn: {
    eiin: "ইআইআইএন",
    year: "শিক্ষাবর্ষ",
    photo: "শিক্ষার্থীর ছবি",
    title: "Student's Admission Form",
    student: "শিক্ষার্থী",
    studentName: "Student's Name",
    id: "আইডি",
    phone: "ফোন",
    email: "ইমেইল",
    dob: "জন্ম তারিখ",
    birthReg: "জন্মনিবন্ধন নং",
    religion: "ধর্ম",
    blood: "রক্তের গ্রুপ",
    course: "Course / Class",
    guardian: "অভিভাবক",
    father: "Father's Name",
    fatherPhone: "Father's Mobile",
    mother: "Mother's Name",
    motherPhone: "Mother's Mobile",
    present: "Present Address",
    permanent: "Permanent Address",
    house: "House",
    village: "Village",
    upazila: "উপজেলা",
    post: "Post Office",
    district: "জেলা",
    declaration:
      "আমি ঘোষণা করিতেছি যে, উপরোক্ত সকল তথ্য সত্য ও সঠিক। কোনো তথ্য মিথ্যা প্রমাণিত হইলে কর্তৃপক্ষের সিদ্ধান্তই চূড়ান্ত বলিয়া গণ্য হইবে।",
    guardianSign: "অভিভাবক",
    signHint: "স্বাক্ষর ও তারিখ",
    office: "অধ্যক্ষ/সচিব",
    sealHint: "সিল ও স্বাক্ষর",
  },
  en: {
    eiin: "EIIN",
    year: "Year",
    photo: "Student photo",
    title: "Student's Admission Form",
    student: "Student",
    studentName: "Student's Name",
    id: "ID",
    phone: "Phone",
    email: "Email",
    dob: "Date of birth",
    birthReg: "Birth registration no.",
    religion: "Religion",
    blood: "Blood group",
    course: "Course / Class",
    guardian: "Guardian",
    father: "Father's Name",
    fatherPhone: "Father's Mobile",
    mother: "Mother's Name",
    motherPhone: "Mother's Mobile",
    present: "Present Address",
    permanent: "Permanent Address",
    house: "House",
    village: "Village",
    upazila: "Upazila",
    post: "Post Office",
    district: "District",
    declaration:
      "I hereby declare that the information given above is true and correct. If any information is found false, the decision of the school authority shall be final.",
    guardianSign: "Guardian",
    signHint: "Signature & date",
    office: "Principal",
    sealHint: "Seal & signature",
  },
} as const;

function dash(value?: string) {
  const text = value?.trim();
  return text || "—";
}

function FieldCell({ label, value, wide }: { label: string; value?: string; wide?: boolean }) {
  return (
    <div className={`admission-cell${wide ? " is-wide" : ""}`}>
      <div>{label}</div>
      <div>{dash(value)}</div>
    </div>
  );
}

function AddressPanel({ title, address, accent, labels }: {
  title: string;
  address?: SlipAddress;
  accent: string;
  labels: { house: string; village: string; upazila: string; post: string; district: string };
}) {
  return (
    <div className="admission-panel">
      <div className="admission-band" style={{ background: accent }}>{title}</div>
      <FieldCell label={labels.house} value={address?.holding} />
      <FieldCell label={labels.village} value={address?.area} />
      <FieldCell label={labels.upazila} value={address?.upazila} />
      <FieldCell label={labels.post} value={address?.postOffice} />
      <FieldCell label={labels.district} value={address?.district} />
    </div>
  );
}

export function AdmissionSlip({ school, data, lang }: { school: SlipSchool; data: SlipData; lang: Lang }) {
  const t = COPY[lang];
  const accent = school.accent || "#14532d";
  const schoolName = school.name?.trim() || "School";

  return (
    <article className="admission-sheet" style={{ ["--admission-accent" as string]: accent }}>
      <div className="admission-frame">
        <div className="admission-inner">
          <header className="admission-head">
            <div className="admission-logo">
              {school.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={school.logoUrl} alt="" />
              ) : (
                <span style={{ color: accent }}>{schoolName.slice(0, 1)}</span>
              )}
            </div>
            <div className="admission-school">
              {school.motto ? <p className="admission-motto">{school.motto}</p> : null}
              <h2 style={{ color: accent }}>{schoolName}</h2>
              {school.address ? <p>{school.address}</p> : null}
              <p>
                {school.eiin ? `${t.eiin}: ${school.eiin}` : null}
                {school.eiin && school.establishedYear ? "  |  " : null}
                {school.establishedYear ? `Est: ${school.establishedYear}` : null}
                {(school.eiin || school.establishedYear) && school.academicYear ? "  |  " : null}
                {school.academicYear ? `${t.year}: ${school.academicYear}` : null}
              </p>
            </div>
            <div className="admission-photo">
              {data.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.photoUrl} alt="" />
              ) : (
                <p>{t.photo}</p>
              )}
            </div>
          </header>

          <div className="admission-title" style={{ background: `color-mix(in srgb, ${accent} 12%, white)`, color: accent }}>
            {t.title}
          </div>

          <section className="admission-panel">
            <div className="admission-band" style={{ background: accent }}>{t.student}</div>
            <div className="admission-grid">
              <FieldCell label={t.studentName} value={data.name || data.nameBn} wide />
              <FieldCell label={t.id} value={data.studentId} />
              <FieldCell label={t.phone} value={data.phone} />
              <FieldCell label={t.email} value={data.email} />
              <FieldCell label={t.dob} value={data.dob} />
              <FieldCell label={t.birthReg} value={data.birthRegNo} />
              <FieldCell label={t.religion} value={data.religion} />
              <FieldCell label={t.blood} value={data.bloodGroup} />
              <FieldCell label={t.course} value={data.courseName} wide />
            </div>
          </section>

          <section className="admission-panel">
            <div className="admission-band" style={{ background: accent }}>{t.guardian}</div>
            <div className="admission-grid">
              <FieldCell label={t.father} value={data.fatherName || data.fatherNameBn} />
              <FieldCell label={t.fatherPhone} value={data.fatherPhone} />
              <FieldCell label={t.mother} value={data.motherName || data.motherNameBn} />
              <FieldCell label={t.motherPhone} value={data.motherPhone} />
            </div>
          </section>

          <div className="admission-addresses">
            <AddressPanel title={t.present} address={data.address} accent={accent} labels={t} />
            <AddressPanel title={t.permanent} address={data.permanentAddress || data.address} accent={accent} labels={t} />
          </div>

          <p className="admission-declaration">{t.declaration}</p>

          <div className="admission-signs">
            <div>
              <div />
              <p>{t.guardianSign}</p>
              <span>{t.signHint}</span>
            </div>
            <div>
              <div />
              <p>{t.office}</p>
              <span>{t.sealHint}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
