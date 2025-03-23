import Cookies from "js-cookie";
import { GET_HOMEPAGE_DATA } from "@/api/graphql/queries";
import BannerTeaser from "@/components/bannerTeaser/BannerTeaser";
import _ from "lodash";
import useFetch from "@/hooks/useFetch";
import FaqForm from "@/components/faqform/FaqForm";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

const fetchHomepageData = async () => {
  try {
    const { data } = await useFetch(GET_HOMEPAGE_DATA);
    return _.get(data, "homepage", {});
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return null;
  }
};

const Homepage = async () => {
  const homepageData = await fetchHomepageData();
  if (_.isEmpty(homepageData)) {
    return <div>No data available</div>;
  }

  const isAuthenticated = Cookies.get("accessToken");

  return (
    <ProtectedRoute>
    <div className="w-full h-full p-6 space-y-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome to the Homepage
        </h1>
        {isAuthenticated ? (
          <button
            // onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </Link>
        )}
      </div>

      <div className="rounded-lg shadow-lg overflow-hidden bg-white p-4">
        <BannerTeaser homedata={homepageData} overlayTeaser={true} />
      </div>

      <div className="rounded-lg shadow-lg overflow-hidden bg-white p-4">
        <FaqForm />
      </div>
    </div>
     </ProtectedRoute>
  );
};

export default Homepage;
