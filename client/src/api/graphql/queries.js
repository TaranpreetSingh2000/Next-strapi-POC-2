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

export { GET_HOMEPAGE_DATA };
