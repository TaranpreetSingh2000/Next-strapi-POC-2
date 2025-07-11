import Homepage from "@/app/pages/homepage/Homepage";
import CustomBlocksRenderer from "@/components/CustomBlocksRenderer ";
import RichContentRenderer from "@/components/RichContentRenderer";
import { fetchHomePageData } from "@/utils/constants";
import _get from "lodash/get";

export default async function Home() {
  const homepageData = await fetchHomePageData();
  console.log(homepageData);
  const richtextdata = _get(homepageData, "homepage", {});
  console.log(richtextdata);

  return (
    <>
      <div className="w-full p-3 h-full">
        <RichContentRenderer content={richtextdata} />
        <CustomBlocksRenderer content={richtextdata.variant2} />
        <Homepage />
      </div>
    </>
  );
}
