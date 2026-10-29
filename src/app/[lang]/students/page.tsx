import { HubPage } from "@/components/content-page";
import { getLang, type LangProps } from "@/lib/locale";

export default async function Page({ params }: LangProps) {
  return <HubPage menuKey="students" lang={await getLang(params)} />;
}
