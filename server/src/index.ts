export default {
  register({ strapi }) {
    const extensionService = strapi.plugin("graphql").service("extension"); //The strapi.plugin('graphql').service('extension') method lets us extend the default GraphQL schema.

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
            resolve: async (_, args: any, ctx: any) => {
              const { name, email, mobile } = args.data;

              // Step 1: Validation checks
              if (!name || !email || !mobile) {
                return {
                  success: false,
                  message: "All fields are required",
                };
              }

              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(email)) {
                return {
                  success: false,
                  message: "Invalid email format",
                };
              }

              const mobileRegex = /^[0-9]{10}$/;
              if (!mobileRegex.test(mobile)) {
                return {
                  success: false,
                  message: "Mobile number must be 10 digits only",
                };
              }

              // Step 2: Check if email already exists in the database
              const existingUser = await strapi.entityService.findMany(
                "api::faq-form.faq-form",
                {
                  filters: { email },
                }
              );

              if (existingUser.length > 0) {
                return {
                  success: false,
                  message: "User with this email already exists",
                };
              }

              // Step 3: Convert mobile to string (to avoid BigInt issues)
              const inputData = {
                ...args.data,
                mobile: String(mobile),
              };

              // Step 4: Create a new entry in the database
              await strapi.service("api::faq-form.faq-form").create({
                data: inputData,
              });

              return {
                success: true,
                message: "Form submitted successfully",
              };
            },
          },
        },
      },
      resolversConfig: {
        "Mutation.createFaqFormSecure": {
          auth: false, // Configure authentication as needed
        },
      },
    });

    extensionService.use(extension);
  },
};
