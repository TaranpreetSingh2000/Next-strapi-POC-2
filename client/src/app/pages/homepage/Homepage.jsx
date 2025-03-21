import { CREATE_FORM_DATA, GET_HOMEPAGE_DATA } from "@/api/graphql/queries";
import BannerTeaser from "@/components/bannerTeaser/BannerTeaser";
import RevenueCards from "@/components/revenuecard/RevenueCards";
import _ from "lodash";
import useFetch from "@/hooks/useFetch";
import FaqForm from "@/components/faqform/FaqForm";

const Homepage = async () => {
  const { data } = await useFetch(GET_HOMEPAGE_DATA);

  const homepageData = _.get(data, "homepage", {});
  const bannerData = _.get(homepageData, "BannerTeaser", []);
  const revenueData = _.get(homepageData, "Revenue", []);

  if (
    _.isEmpty(homepageData) ||
    _.isEmpty(bannerData) ||
    _.isEmpty(revenueData)
  ) {
    return <div>No data available</div>;
  }

  return (
    <div className="font-black w-full h-full space-y-4">
      <BannerTeaser homedata={data.homepage} overlayTeaser={true} />
      <RevenueCards revenuedata={data.homepage.Revenue} />
      <FaqForm/>
    </div>
  );
};

export default Homepage;
