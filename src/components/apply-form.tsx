"use client";

import { useState } from "react";
import { AdmissionSlip, type SlipSchool } from "@/components/admission-slip";
import type { ClassItem, Lang } from "@/lib/types";

const field = "mt-1 h-10 w-full rounded-md border border-line bg-card px-3 text-sm";

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

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
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
      setMessage(bn ? "ছবি ১৮০ কিলোবাইটের মধ্যে রাখুন।" : "Keep the photo under 180 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set("photoUrl", String(reader.result ?? ""));
    reader.readAsDataURL(file);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const address = form.address;
    const permanent = samePermanent ? address : form.permanentAddress;
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
        group: form.group || "None",
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
    const json = (await response.json().catch(() => ({}))) as { message?: string; data?: { studentId?: string } };
    if (!response.ok) {
      setMessage(json.message || (bn ? "আবেদন জমা হয়নি।" : "The application was not saved."));
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
          lang={lang}
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
    <form className="sheet mx-auto max-w-3xl space-y-6 px-4 py-5 md:px-6" onSubmit={submit} suppressHydrationWarning>
      <p className="text-sm leading-6 text-muted">
        {bn
          ? `${year} শিক্ষাবর্ষ। সব ঘর এই এক ফর্মে। ধাপ নেই। জমা দিলে আবেদন অপেক্ষমাণ থাকবে। স্কুল অনুমোদন করলে তবে ভর্তি। ফি নগদ, বিকাশ, নগদ, রকেট, ব্যাংক বা চেকে অফিসে।`
          : `${year}. Every field is on this one form. There are no steps. Submitting keeps the application pending until the school approves it. Pay at the office by cash, bKash, Nagad, Rocket, bank, or cheque.`}
      </p>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">{bn ? "শিক্ষার্থী" : "Student"}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">{bn ? "নাম" : "Name"}
            <input required minLength={2} className={field} value={form.name} onChange={(event) => set("name", event.target.value)} />
          </label>
          <label className="block text-sm sm:col-span-2">{bn ? "নাম (বাংলা)" : "Name in Bangla"}
            <input className={field} value={form.nameBn} onChange={(event) => set("nameBn", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "লিঙ্গ" : "Gender"}
            <select className={field} value={form.gender} onChange={(event) => set("gender", event.target.value)}>
              <option value="male">{bn ? "ছাত্র" : "Male"}</option>
              <option value="female">{bn ? "ছাত্রী" : "Female"}</option>
              <option value="other">{bn ? "অন্যান্য" : "Other"}</option>
            </select>
          </label>
          <label className="block text-sm">{bn ? "জন্মতারিখ" : "Date of birth"}
            <input type="text" inputMode="numeric" placeholder="YYYY-MM-DD" className={field} value={form.dob} onChange={(event) => set("dob", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "জন্মনিবন্ধন" : "Birth registration"}
            <input className={field} value={form.birthRegNo} onChange={(event) => set("birthRegNo", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "রক্তের গ্রুপ" : "Blood group"}
            <input className={field} value={form.bloodGroup} onChange={(event) => set("bloodGroup", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "ধর্ম" : "Religion"}
            <input className={field} value={form.religion} onChange={(event) => set("religion", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "ফোন" : "Phone"}
            <input className={field} inputMode="tel" value={form.phone} onChange={(event) => set("phone", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "ইমেইল" : "Email"}
            <input type="email" className={field} value={form.email} onChange={(event) => set("email", event.target.value)} />
          </label>
          <label className="block text-sm sm:col-span-2">{bn ? "ছবি (ঐচ্ছিক, ছোট)" : "Photo (optional, small)"}
            <input className={field} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onPhoto(event.target.files?.[0])} />
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">{bn ? "ক্লাস" : "Class"}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">{bn ? "ক্লাস" : "Class"}
            <select
              required
              className={field}
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
          <label className="block text-sm">{bn ? "বাবার নাম" : "Father's name"}
            <input className={field} value={form.fatherName} onChange={(event) => set("fatherName", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "বাবার নাম (বাংলা)" : "Father's name in Bangla"}
            <input className={field} value={form.fatherNameBn} onChange={(event) => set("fatherNameBn", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "বাবার ফোন" : "Father's phone"}
            <input className={field} inputMode="tel" value={form.fatherPhone} onChange={(event) => set("fatherPhone", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "মায়ের নাম" : "Mother's name"}
            <input className={field} value={form.motherName} onChange={(event) => set("motherName", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "মায়ের নাম (বাংলা)" : "Mother's name in Bangla"}
            <input className={field} value={form.motherNameBn} onChange={(event) => set("motherNameBn", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "মায়ের ফোন" : "Mother's phone"}
            <input className={field} inputMode="tel" value={form.motherPhone} onChange={(event) => set("motherPhone", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "অভিভাবকের নাম" : "Guardian name"}
            <input required minLength={2} className={field} value={form.guardianName} onChange={(event) => set("guardianName", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "অভিভাবকের নাম (বাংলা)" : "Guardian name in Bangla"}
            <input className={field} value={form.guardianNameBn} onChange={(event) => set("guardianNameBn", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "সম্পর্ক" : "Relation"}
            <input className={field} value={form.relation} onChange={(event) => set("relation", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "অভিভাবকের ফোন" : "Guardian phone"}
            <input required minLength={6} className={field} inputMode="tel" value={form.guardianPhone} onChange={(event) => set("guardianPhone", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "জাতীয় পরিচয়পত্র" : "National ID"}
            <input className={field} value={form.nid} onChange={(event) => set("nid", event.target.value)} />
          </label>
          <label className="block text-sm">{bn ? "পেশা" : "Occupation"}
            <input className={field} value={form.occupation} onChange={(event) => set("occupation", event.target.value)} />
          </label>
        </div>
      </fieldset>

      {message ? <p className="text-sm text-red-700">{message}</p> : null}
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
