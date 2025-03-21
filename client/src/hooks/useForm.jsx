import client from "@/api/graphql/client";

const useForm = async (mutation, payload) => {
    debugger;
    console.log(mutation, payload, '--> reached useform')
  try {
    const { data } = await client.mutate({
      mutation: mutation,
      variables: payload,
    });
    return { data };
  } catch (error) {
    console.log("Error while executing the query", error);
  }

};

export default useForm;
