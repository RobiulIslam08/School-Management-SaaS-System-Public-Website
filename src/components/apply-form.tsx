"use client";

import { useState } from "react";
import { AdmissionSlip, type SlipSchool } from "@/components/admission-slip";
import type { ClassItem, Lang } from "@/lib/types";

const field = "mt-1 h-10 w-full rounded-md border border-line bg-card px-3 text-sm";
const fieldBad = `${field} border-red-700 ring-1 ring-red-700`;

type FieldErrors = Record<string, string>;

const SERVER_KEY: Record<string, string> = {
  "guardian.guardianName": "guardianName",
  "guardian.guardianNameBn": "guardianNameBn",
  "guardian.phone": "guardianPhone",
  "guardian.fatherName": "fatherName",
  "guardian.fatherNameBn": "fatherNameBn",
  "guardian.fatherPhone": "fatherPhone",
  "guardian.motherName": "motherName",
  "guardian.motherNameBn": "motherNameBn",
  "guardian.motherPhone": "motherPhone",
  "guardian.nid": "nid",
  "guardian.relation": "relation",
  "guardian.occupation": "occupation",
};

function digits(value: string, max: number) {
  return value.replace(/\D/g, "").slice(0, max);
}

function focusField(id: string) {
  requestAnimationFrame(() => {
    const node = document.getElementById(id);
    node?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (node instanceof HTMLElement) node.focus();
  });
}

type Address = {
  holding: string;
  area: string;
  upazila: string;
  postOffice: string;
  district: string;
  division: string;
};

const emptyAddress = (): Address => ({
  holding: "",
  area: "",
  upazila: "",
  postOffice: "",
  district: "",
  division: "",
});

export function ApplyForm({ classes, lang, year, school }: { classes: ClassItem[]; lang: Lang; year: string; school: SlipSchool }) {
  const bn = lang === "bn";
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [done, setDone] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [samePermanent, setSamePermanent] = useState(true);
  const [form, setForm] = useState({
    name: "",
    nameBn: "",
    gender: "male",
    dob: "",
    birthRegNo: "",
    bloodGroup: "",
    religion: "",
    phone: "",
    email: "",
    photoUrl: "",
    classId: classes[0]?._id ?? "",
    section: classes[0]?.sections[0] ?? "A",
    group: classes[0]?.group && classes[0].group !== "None" ? classes[0].group : "None",
    previousSchool: "",
    address: emptyAddress(),
    permanentAddress: emptyAddress(),
    fatherName: "",
    fatherNameBn: "",
    fatherPhone: "",
    motherName: "",
    motherNameBn: "",
    motherPhone: "",
    guardianName: "",
    guardianNameBn: "",
    relation: "Father",
    nid: "",
    guardianPhone: "",
    occupation: "",
  });

  function clearError(key: string) {
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    clearError(key);
  }

  function labelFor(key: string) {
    const labels: Record<string, [string, string]> = {
      name: ["নাম (ইংরেজিতে)", "Name (English)"],
      nameBn: ["নাম (বাংলায়)", "Name (বাংলায়)"],
      dob: ["জন্মতারিখ", "Date of birth"],
      birthRegNo: ["জন্মনিবন্ধন", "Birth registration"],
      phone: ["ফোন", "Phone"],
      email: ["ইমেইল", "Email"],
      photoUrl: ["ছবি", "Photo"],
      classId: ["ক্লাস", "Class"],
      fatherNameBn: ["বাবার নাম (বাংলায়)", "Father's name (বাংলায়)"],
      fatherPhone: ["বাবার ফোন", "Father's phone"],
      motherNameBn: ["মায়ের নাম (বাংলায়)", "Mother's name (বাংলায়)"],
      motherPhone: ["মায়ের ফোন", "Mother's phone"],
      guardianName: ["অভিভাবকের নাম (ইংরেজিতে)", "Guardian name (English)"],
      guardianNameBn: ["অভিভাবকের নাম (বাংলায়)", "Guardian name (বাংলায়)"],
      guardianPhone: ["অভিভাবকের ফোন", "Guardian phone"],
      nid: ["জাতীয় পরিচয়পত্র", "National ID"],
    };
    const pair = labels[key];
    return pair ? pair[bn ? 0 : 1] : key;
  }

  function explain(key: string) {
    const copy: Record<string, [string, string]> = {
      name: ["নাম অন্তত ২ অক্ষর দিন।", "Enter at least 2 characters."],
      guardianName: ["অভিভাবকের নাম অন্তত ২ অক্ষর দিন।", "Enter at least 2 characters."],
      guardianPhone: ["অভিভাবকের ফোনে অন্তত ৬টি সংখ্যা দিন।", "Enter at least 6 digits."],
      email: ["ইমেইল ঠিক নয়। খালি রাখতে পারেন।", "This email is not valid. You can leave it empty."],
      dob: ["ক্যালেন্ডার থেকে জন্মতারিখ বেছে নিন।", "Pick the date of birth from the calendar."],
      photoUrl: ["ছবি JPG, PNG বা WebP, ১৮০ কিলোবাইটের মধ্যে।", "Use a JPG, PNG, or WebP under 180 KB."],
      classId: ["ক্লাস বেছে নিন।", "Choose a class."],
    };
    const pair = copy[key];
    return pair ? pair[bn ? 0 : 1] : bn ? "এই ঘর ঠিক করুন।" : "Check this field.";
  }

  function problems() {
    const next: FieldErrors = {};
    if (form.name.trim().length < 2) next.name = explain("name");
    if (!form.classId) next.classId = explain("classId");
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = explain("email");
    if (form.dob && !/^\d{4}-\d{2}-\d{2}$/.test(form.dob)) next.dob = explain("dob");
    if (form.guardianName.trim().length < 2) next.guardianName = explain("guardianName");
    if (digits(form.guardianPhone, 14).length < 6) next.guardianPhone = explain("guardianPhone");
    return next;
  }

  function setAddress(key: keyof Address, value: string, permanent = false) {
    setForm((current) => {
      const next = { ...(permanent ? current.permanentAddress : current.address), [key]: value };
      return permanent ? { ...current, permanentAddress: next } : { ...current, address: next };
    });
  }

  function onPhoto(file: File | undefined) {
    if (!file) return;
    if (file.size > 180 * 1024) {
      setErrors((current) => ({ ...current, photoUrl: explain("photoUrl") }));
      focusField("photoUrl");
      return;
    }
    clearError("photoUrl");
    const reader = new FileReader();
    reader.onload = () => set("photoUrl", String(reader.result ?? ""));
    reader.readAsDataURL(file);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const local = problems();
    if (Object.keys(local).length) {
      setErrors(local);
      const names = Object.keys(local).map(labelFor).join(", ");
      setMessage(bn ? `এই ঘরগুলো ঠিক করুন: ${names}` : `Check these fields: ${names}`);
      focusField(Object.keys(local)[0]);
      return;
    }
    setPending(true);
    setMessage("");
    setErrors({});
    const address = form.address;
    const permanent = samePermanent ? address : form.permanentAddress;
    const group = ["Science", "Business", "Humanities", "None"].includes(form.group) ? form.group : "None";
    try {
    const response = await fetch("/api/v1/public/admissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        nameBn: form.nameBn,
        gender: form.gender,
        academicYear: year || String(new Date().getFullYear()),
        classId: form.classId,
        section: form.section || "A",
        group,
        phone: form.phone,
        email: form.email,
        dob: form.dob,
        birthRegNo: form.birthRegNo,
        bloodGroup: form.bloodGroup,
        religion: form.religion,
        photoUrl: form.photoUrl,
        previousSchool: form.previousSchool,
        address,
        permanentAddress: permanent,
        guardian: {
          fatherName: form.fatherName,
          fatherNameBn: form.fatherNameBn,
          fatherPhone: form.fatherPhone,
          motherName: form.motherName,
          motherNameBn: form.motherNameBn,
          motherPhone: form.motherPhone,
          guardianName: form.guardianName,
          guardianNameBn: form.guardianNameBn,
          relation: form.relation,
          nid: form.nid,
          phone: form.guardianPhone,
          occupation: form.occupation,
        },
      }),
    });
    const json = (await response.json().catch(() => ({}))) as {
      message?: string;
      data?: { studentId?: string };
      errors?: Array<{ field?: string; message?: string }> | null;
    };
    if (!response.ok) {
      const next: FieldErrors = {};
      for (const item of json.errors ?? []) {
        if (!item.field) continue;
        const key = SERVER_KEY[item.field] ?? item.field;
        next[key] = explain(key);
      }
      if (Object.keys(next).length) {
        setErrors(next);
        const names = Object.keys(next).map(labelFor).join(", ");
        setMessage(bn ? `এই ঘরগুলো ঠিক করুন: ${names}` : `Check these fields: ${names}`);
        focusField(Object.keys(next)[0]);
      } else {
        setMessage(json.message || (bn ? "আবেদন জমা হয়নি।" : "The application was not saved."));
      }
      return;
    }
    setApplicationId(json.data?.studentId ?? "");
    setDone(true);
    } catch {
      setMessage(bn ? "আবেদন জমা হয়নি।" : "The application was not saved.");
    } finally {
      setPending(false);
    }
  }

  const selected = classes.find((item) => item._id === form.classId);
  const dobMax = `${new Date().getFullYear()}-12-31`;

  function control(id: string) {
    const invalid = Boolean(errors[id]);
    return {
      id,
      className: invalid ? fieldBad : field,
      "aria-invalid": invalid || undefined,
      "aria-describedby": invalid ? `${id}-error` : undefined,
    };
  }

  function hint(id: string) {
    if (!errors[id]) return null;
    return (
      <span id={`${id}-error`} className="mt-1 block text-xs font-medium text-red-700">
        {errors[id]}
      </span>
    );
  }

  if (done) {
    const course = [selected?.name, form.section].filter(Boolean).join(" · ");
    const address = form.address;
    const permanent = samePermanent ? address : form.permanentAddress;
    return (
      <div className="admission-print-root mx-auto max-w-[210mm] px-4 py-8">
        <div className="no-print admission-saved">
          <p>
            {bn
              ? "আবেদন জমা হয়েছে এবং অপেক্ষমাণ আছে। স্কুল অনুমোদন না করা পর্যন্ত ভর্তি হয়নি। সিট নিশ্চিত নয়। এই ফর্ম এখনই ডাউনলোড করুন — পরে এই পাতা থেকে আর খোলা যাবে না। ছাপানো ফর্ম ও কাগজ অফিসে জমা দিন। ফি অফিসে, এই সাইটে টাকা কাটা হয় না।"
              : "The application is saved and waiting. It is not an admission until the school approves it. A seat is not confirmed. Download this form now — it cannot be opened again from this page. Bring the printed form and the papers to the office. Pay the fee there. This site does not take payment."}
          </p>
          <p className="admission-number">
            {bn ? "আবেদন নম্বর" : "Application number"}: <strong>{applicationId || "—"}</strong>
          </p>
          <button type="button" className="marksheet-print" onClick={() => window.print()}>
            {bn ? "পিডিএফ ডাউনলোড / প্রিন্ট" : "Download / print PDF"}
          </button>
        </div>
        <AdmissionSlip
          school={school}
          data={{
            studentId: applicationId,
            name: form.name,
            nameBn: form.nameBn,
            phone: form.phone,
            email: form.email,
            dob: form.dob,
            birthRegNo: form.birthRegNo,
            religion: form.religion,
            bloodGroup: form.bloodGroup,
            photoUrl: form.photoUrl,
            courseName: course,
            fatherName: form.fatherName,
            fatherNameBn: form.fatherNameBn,
            fatherPhone: form.fatherPhone,
            motherName: form.motherName,
            motherNameBn: form.motherNameBn,
            motherPhone: form.motherPhone,
            address,
            permanentAddress: permanent,
          }}
        />
      </div>
    );
  }

  return (
    <form noValidate className="sheet mx-auto max-w-3xl space-y-6 px-4 py-5 md:px-6" onSubmit={submit} suppressHydrationWarning>
      <p className="text-sm leading-6 text-muted">
        {bn
          ? `${year} শিক্ষাবর্ষ। সব ঘর এই এক ফর্মে। ধাপ নেই। জমা দিলে আবেদন অপেক্ষমাণ থাকবে। স্কুল অনুমোদন করলে তবে ভর্তি। ফি নগদ, বিকাশ, নগদ, রকেট, ব্যাংক বা চেকে অফিসে।`
          : `${year}. Every field is on this one form. There are no steps. Submitting keeps the application pending until the school approves it. Pay at the office by cash, bKash, Nagad, Rocket, bank, or cheque.`}
      </p>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">{bn ? "শিক্ষার্থী" : "Student"}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2" htmlFor="name">{bn ? "নাম (ইংরেজিতে)" : "Name (English)"}
            <input required minLength={2} autoComplete="name" {...control("name")} value={form.name} onChange={(event) => set("name", event.target.value)} />
            {hint("name")}
          </label>
          <label className="block text-sm sm:col-span-2" htmlFor="nameBn">{bn ? "নাম (বাংলায়)" : "Name (বাংলায়)"}
            <input lang="bn" autoComplete="off" {...control("nameBn")} value={form.nameBn} onChange={(event) => set("nameBn", event.target.value)} />
            {hint("nameBn")}
          </label>
          <label className="block text-sm" htmlFor="gender">{bn ? "লিঙ্গ" : "Gender"}
            <select {...control("gender")} value={form.gender} onChange={(event) => set("gender", event.target.value)}>
              <option value="male">{bn ? "ছাত্র" : "Male"}</option>
              <option value="female">{bn ? "ছাত্রী" : "Female"}</option>
              <option value="other">{bn ? "অন্যান্য" : "Other"}</option>
            </select>
            {hint("gender")}
          </label>
          <label className="block text-sm" htmlFor="dob">{bn ? "জন্মতারিখ" : "Date of birth"}
            <input type="date" min="1990-01-01" max={dobMax} autoComplete="bday" {...control("dob")} value={form.dob} onChange={(event) => set("dob", event.target.value)} />
            {hint("dob")}
          </label>
          <label className="block text-sm" htmlFor="birthRegNo">{bn ? "জন্মনিবন্ধন" : "Birth registration"}
            <input inputMode="numeric" autoComplete="off" placeholder="01234567890123456" {...control("birthRegNo")} value={form.birthRegNo} onChange={(event) => set("birthRegNo", digits(event.target.value, 17))} />
            {hint("birthRegNo")}
          </label>
          <label className="block text-sm" htmlFor="bloodGroup">{bn ? "রক্তের গ্রুপ" : "Blood group"}
            <input {...control("bloodGroup")} value={form.bloodGroup} onChange={(event) => set("bloodGroup", event.target.value)} />
            {hint("bloodGroup")}
          </label>
          <label className="block text-sm" htmlFor="religion">{bn ? "ধর্ম" : "Religion"}
            <input {...control("religion")} value={form.religion} onChange={(event) => set("religion", event.target.value)} />
            {hint("religion")}
          </label>
          <label className="block text-sm" htmlFor="phone">{bn ? "ফোন" : "Phone"}
            <input inputMode="numeric" autoComplete="tel" placeholder="01XXXXXXXXX" {...control("phone")} value={form.phone} onChange={(event) => set("phone", digits(event.target.value, 14))} />
            {hint("phone")}
          </label>
          <label className="block text-sm" htmlFor="email">{bn ? "ইমেইল" : "Email"}
            <input type="email" autoComplete="email" {...control("email")} value={form.email} onChange={(event) => set("email", event.target.value)} />
            {hint("email")}
          </label>
          <label className="block text-sm sm:col-span-2" htmlFor="photoUrl">{bn ? "ছবি (ঐচ্ছিক, ছোট)" : "Photo (optional, small)"}
            <input {...control("photoUrl")} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onPhoto(event.target.files?.[0])} />
            {hint("photoUrl")}
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">{bn ? "ক্লাস" : "Class"}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm" htmlFor="classId">{bn ? "ক্লাস" : "Class"}
            <select
              required
              {...control("classId")}
              value={form.classId}
              onChange={(event) => {
                const next = classes.find((item) => item._id === event.target.value);
                set("classId", event.target.value);
                set("section", next?.sections[0] ?? "A");
                set("group", next?.group && next.group !== "None" ? next.group : "None");
              }}
            >
              {classes.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
            </select>
            {hint("classId")}
          </label>
          <label className="block text-sm">{bn ? "শাখা" : "Section"}
            <select className={field} value={form.section} onChange={(event) => set("section", event.target.value)}>
              {(selected?.sections.length ? selected.sections : ["A"]).map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label className="block text-sm sm:col-span-2">{bn ? "আগের স্কুল" : "Previous school"}
            <input className={field} value={form.previousSchool} onChange={(event) => set("previousSchool", event.target.value)} />
          </label>
        </div>
      </fieldset>

      <AddressFields title={bn ? "বর্তমান ঠিকানা" : "Present address"} address={form.address} bn={bn} onChange={(key, value) => setAddress(key, value)} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={samePermanent} onChange={(event) => setSamePermanent(event.target.checked)} />
        {bn ? "স্থায়ী ঠিকানা একই" : "Permanent address is the same"}
      </label>
      {samePermanent ? null : (
        <AddressFields title={bn ? "স্থায়ী ঠিকানা" : "Permanent address"} address={form.permanentAddress} bn={bn} onChange={(key, value) => setAddress(key, value, true)} />
      )}

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">{bn ? "বাবা, মা ও অভিভাবক" : "Parents and guardian"}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm" htmlFor="fatherName">{bn ? "বাবার নাম (ইংরেজিতে)" : "Father's name (English)"}
            <input autoComplete="off" {...control("fatherName")} value={form.fatherName} onChange={(event) => set("fatherName", event.target.value)} />
            {hint("fatherName")}
          </label>
          <label className="block text-sm" htmlFor="fatherNameBn">{bn ? "বাবার নাম (বাংলায়)" : "Father's name (বাংলায়)"}
            <input lang="bn" autoComplete="off" {...control("fatherNameBn")} value={form.fatherNameBn} onChange={(event) => set("fatherNameBn", event.target.value)} />
            {hint("fatherNameBn")}
          </label>
          <label className="block text-sm" htmlFor="fatherPhone">{bn ? "বাবার ফোন" : "Father's phone"}
            <input inputMode="numeric" autoComplete="tel" placeholder="01XXXXXXXXX" {...control("fatherPhone")} value={form.fatherPhone} onChange={(event) => set("fatherPhone", digits(event.target.value, 14))} />
            {hint("fatherPhone")}
          </label>
          <label className="block text-sm" htmlFor="motherName">{bn ? "মায়ের নাম (ইংরেজিতে)" : "Mother's name (English)"}
            <input autoComplete="off" {...control("motherName")} value={form.motherName} onChange={(event) => set("motherName", event.target.value)} />
            {hint("motherName")}
          </label>
          <label className="block text-sm" htmlFor="motherNameBn">{bn ? "মায়ের নাম (বাংলায়)" : "Mother's name (বাংলায়)"}
            <input lang="bn" autoComplete="off" {...control("motherNameBn")} value={form.motherNameBn} onChange={(event) => set("motherNameBn", event.target.value)} />
            {hint("motherNameBn")}
          </label>
          <label className="block text-sm" htmlFor="motherPhone">{bn ? "মায়ের ফোন" : "Mother's phone"}
            <input inputMode="numeric" autoComplete="tel" placeholder="01XXXXXXXXX" {...control("motherPhone")} value={form.motherPhone} onChange={(event) => set("motherPhone", digits(event.target.value, 14))} />
            {hint("motherPhone")}
          </label>
          <label className="block text-sm" htmlFor="guardianName">{bn ? "অভিভাবকের নাম (ইংরেজিতে)" : "Guardian name (English)"}
            <input required minLength={2} autoComplete="name" {...control("guardianName")} value={form.guardianName} onChange={(event) => set("guardianName", event.target.value)} />
            {hint("guardianName")}
          </label>
          <label className="block text-sm" htmlFor="guardianNameBn">{bn ? "অভিভাবকের নাম (বাংলায়)" : "Guardian name (বাংলায়)"}
            <input lang="bn" autoComplete="off" {...control("guardianNameBn")} value={form.guardianNameBn} onChange={(event) => set("guardianNameBn", event.target.value)} />
            {hint("guardianNameBn")}
          </label>
          <label className="block text-sm" htmlFor="relation">{bn ? "সম্পর্ক" : "Relation"}
            <input {...control("relation")} value={form.relation} onChange={(event) => set("relation", event.target.value)} />
            {hint("relation")}
          </label>
          <label className="block text-sm" htmlFor="guardianPhone">{bn ? "অভিভাবকের ফোন" : "Guardian phone"}
            <input required inputMode="numeric" autoComplete="tel" placeholder="01XXXXXXXXX" {...control("guardianPhone")} value={form.guardianPhone} onChange={(event) => set("guardianPhone", digits(event.target.value, 14))} />
            {hint("guardianPhone")}
          </label>
          <label className="block text-sm" htmlFor="nid">{bn ? "জাতীয় পরিচয়পত্র" : "National ID"}
            <input inputMode="numeric" autoComplete="off" {...control("nid")} value={form.nid} onChange={(event) => set("nid", digits(event.target.value, 17))} />
            {hint("nid")}
          </label>
          <label className="block text-sm">{bn ? "পেশা" : "Occupation"}
            <input className={field} value={form.occupation} onChange={(event) => set("occupation", event.target.value)} />
          </label>
        </div>
      </fieldset>

      {message ? <p className="text-sm font-medium text-red-700" role="alert">{message}</p> : null}
      <p className="text-xs leading-5 text-muted">
        {bn
          ? "সিট নিশ্চিত নয়। অনুমোদনের আগে ভর্তি হয় না। ভর্তি ফি অফিসে। রসিদ অফিস থেকে নিন।"
          : "A seat is not confirmed. There is no admission before approval. Pay the fee at the office and collect the receipt there."}
      </p>
      <button disabled={pending} className="h-10 rounded-full bg-brand px-5 text-sm font-semibold text-on-brand disabled:opacity-60" type="submit">
        {bn ? "আবেদন জমা দিন" : "Submit application"}
      </button>
    </form>
  );
}

function AddressFields({
  title,
  address,
  bn,
  onChange,
}: {
  title: string;
  address: Address;
  bn: boolean;
  onChange: (key: keyof Address, value: string) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold">{title}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">{bn ? "বিভাগ" : "Division"}
          <input className={field} value={address.division} onChange={(event) => onChange("division", event.target.value)} />
        </label>
        <label className="block text-sm">{bn ? "জেলা" : "District"}
          <input className={field} value={address.district} onChange={(event) => onChange("district", event.target.value)} />
        </label>
        <label className="block text-sm">{bn ? "উপজেলা" : "Upazila"}
          <input className={field} value={address.upazila} onChange={(event) => onChange("upazila", event.target.value)} />
        </label>
        <label className="block text-sm">{bn ? "ডাকঘর" : "Post office"}
          <input className={field} value={address.postOffice} onChange={(event) => onChange("postOffice", event.target.value)} />
        </label>
        <label className="block text-sm">{bn ? "এলাকা / গ্রাম" : "Area / village"}
          <input className={field} value={address.area} onChange={(event) => onChange("area", event.target.value)} />
        </label>
        <label className="block text-sm">{bn ? "বাসা / হোল্ডিং" : "House / holding"}
          <input className={field} value={address.holding} onChange={(event) => onChange("holding", event.target.value)} />
        </label>
      </div>
    </fieldset>
  );
}
