import type { Schema, Struct } from '@strapi/strapi';

export interface BannerBanner extends Struct.ComponentSchema {
  collectionName: 'components_banner_banners';
  info: {
    description: '';
    displayName: 'Banner';
  };
  attributes: {
    bannerImg: Schema.Attribute.Media<'images' | 'files', true> &
      Schema.Attribute.Required;
    buttontext: Schema.Attribute.String;
    description: Schema.Attribute.String;
    heading: Schema.Attribute.String;
  };
}

export interface ButtonButton extends Struct.ComponentSchema {
  collectionName: 'components_button_buttons';
  info: {
    displayName: 'Button';
  };
  attributes: {
    buttonText: Schema.Attribute.String;
  };
}

export interface RevenueRevenue extends Struct.ComponentSchema {
  collectionName: 'components_revenue_revenues';
  info: {
    description: '';
    displayName: 'Revenue';
  };
  attributes: {
    description: Schema.Attribute.String;
    image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    suptext: Schema.Attribute.String;
    tagline: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface RevenueRevenueImg extends Struct.ComponentSchema {
  collectionName: 'components_revenue_revenue_imgs';
  info: {
    displayName: 'revenueImg';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'banner.banner': BannerBanner;
      'button.button': ButtonButton;
      'revenue.revenue': RevenueRevenue;
      'revenue.revenue-img': RevenueRevenueImg;
    }
  }
}
