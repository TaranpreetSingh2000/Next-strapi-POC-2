import client from "@/api/graphql/client";
import { GET_HOMEPAGE_DATA } from "@/api/graphql/queries";

const executeMutation = async (mutation, payload) => {
  try {
    console.log("Executing mutation:", mutation, "with payload:", payload);

    const { data } = await client.mutate({
      mutation,
      variables: payload,
    });

    return { data };
  } catch (error) {
    console.error("Error while executing the mutation:", error);
    throw error;
  }
};

export default executeMutation;

const fetchHomePageData = async () => {
  try {
    const response = await client.query({
      query: GET_HOMEPAGE_DATA,
      context: {
        fetchOptions: {
          cache: "no-store",
        },
      },
      fetchPolicy: "no-cache",
    });
    return response.data;
  } catch (error) {
    console.log("error", error);
    return {};
  }
};

export { fetchHomePageData };
