export default {
  register({ strapi }) {
    const extensionService = strapi.plugin('graphql').service('extension');

    const extension = ({ nexus }) => ({
      typeDefs: `
        type CreateFaqForms {
          success: Boolean
          message: String
        }
        
        extend type Mutation {
          createFaqFormSecure(data: FaqFormInput!): CreateFaqForms
        }
      `,
      resolvers: {
        Mutation: {
          createFaqFormSecure: {
            resolve: async (_, args:any, ctx: any) => {
              const inputData = {
                ...args.data,
                mobile: String(args.data.mobile) // Convert mobile to string
              };

              console.log("Final Data to be Saved:", inputData);

              await strapi.service('api::faq-form.faq-form').create({
                data: inputData
              });

              return { 
                success: true, 
                message: "Form submitted successfully" 
              };
            },
          },
        },
      },
      resolversConfig: {
        'Mutation.createFaqFormSecure': {
          auth: false, // or configure as needed
        },
      },
    });

    extensionService.use(extension);
  }
};
