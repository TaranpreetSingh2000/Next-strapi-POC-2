import Homepage from "@/app/pages/homepage/Homepage";
import RichContentRenderer from "@/components/RichContentRenderer";
import { fetchHomePageData } from "@/utils/constants";
import _get from "lodash/get";

export default async function Home() {
  const homepageData = await fetchHomePageData();
  console.log(homepageData)
  const richtextdata = _get(homepageData, "homepage.richtext", {});
  console.log(richtextdata);

  return (
    <>
      <div className="w-full p-3 h-full">
        <RichContentRenderer content={richtextdata} />
        <Homepage />
      </div>
    </>
  );
}
