import client from "@/api/graphql/client";
import React from "react";

const useFetch = async (query) => {
  try {
    const { data } = await client.query({
      query: query,
    });
    return { data };
  } catch (error) {
    console.log("Error while executing the query", error);
  }

  console.log(data, "-->");
};

export default useFetch;
