import { GET_HOMEPAGE_DATA } from "@/api/graphql/queries";
import client from "@/api/graphql/client";
import BannerTeaser from "@/components/bannerTeaser/BannerTeaser";
import RevenueCards from "@/components/revenuecard/RevenueCards";

const Homepage = async () => {
  const { data } = await client.query({
    query: GET_HOMEPAGE_DATA,
  });

  if (!data) {
    return <div>No data available</div>;
  }


  return (
    <div className="font-black w-full h-full space-y-4">
      <BannerTeaser homedata={data.homepage} overlayTeaser={true}/>
       <RevenueCards revenuedata={data.homepage.Revenue}/>
    </div>
  );
};

export default Homepage;
