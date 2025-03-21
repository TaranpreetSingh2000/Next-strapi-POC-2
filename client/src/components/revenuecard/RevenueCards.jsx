import React from "react";

const RevenueCards = ({ revenuedata }) => {
  const endPointUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  return (
    <div className="revenue-container py-3 flex flex-col md:flex-row items-center">
      <div className="card-img max-md:flex md:w-[22%]">
        {revenuedata?.length > 0 &&
          revenuedata[0].image?.map((data, index) => (
            <img
              src={endPointUrl + data.url}
              className="w-[150px] h-[140px] max-md:object-cover md:w-[324px] md:h-[250px]"
              alt={index}
              key={index}
            />
          ))}
      </div>
      <div className="revenue-section w-full md:w-[78%] mx-4 p-5 grid grid-cols-1 md:grid-cols-2 gap-y-6 items-center ">
        {revenuedata?.length > 0 &&
          revenuedata?.map((data) => (
            <div className="revenue-card pb-4 max-md:border-b md:nth-[1]:border-b md:nth-[2]:border-b border-gray-400 flex flex-col gap-y-2 md:nth-[1]:pb-8 md:nth-[2]:pb-8">
              <div className="mb-2 space-y-2">
                <h3 className="font-light text-2xl uppercase tracking-wider">
                  <span className="text-4xl font-normal">{data.suptext}</span>
                  {data.tagline}
                </h3>
                <span className="text-xl font-normal tracking-widest">
                  {data.title}
                </span>
              </div>
              <p className="text-gray-700 font-normal text-md md:max-w-[450px]">
                {data.description}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RevenueCards;
