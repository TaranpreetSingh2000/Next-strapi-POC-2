import { gql } from "@apollo/client";

const GET_HOMEPAGE_DATA = gql`
  query Homepage {
    homepage {
      BannerTeaser {
        heading
        bannerImg {
          url
        }
        description
        buttontext
      }
      Revenue {
        suptext
        tagline
        description
        title
        image {
          url
        }
      }
    }
  }
`;

const CREATE_FORM_DATA = gql`
  mutation CreateFaqForms($data: FaqFormInput!) {
    createFaqForm(data: $data) {
      name
    }
  }
`;
export { GET_HOMEPAGE_DATA, CREATE_FORM_DATA };
