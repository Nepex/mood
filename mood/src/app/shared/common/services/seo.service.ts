import { Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { environment } from '@env';

import { DefaultSEOImgs, SiteMetaData, SiteMetaDataOverrides } from '../types';

@Injectable({ providedIn: 'root' })
export class SEOService {
  isInitialized = false;
  defaultMetaData: Partial<SiteMetaData> = {};
  defaultSeoImages: DefaultSEOImgs = {};

  constructor(private readonly meta: Meta, private readonly title: Title) {
    this.defaultMetaData = {
      title: environment.appTitle || '',
    } as SiteMetaData;
    const siteUrl = environment.appBaseUrl;

    this.defaultMetaData = {
      ...this.defaultMetaData,
      siteUrl,
    };
  }

  setSEO(overrides: SiteMetaDataOverrides = {}, defaultImgs?: DefaultSEOImgs) {
    if (defaultImgs) {
      this.defaultSeoImages = defaultImgs;
    }

    this.resetSEO();

    const overrideKeys = Object.keys(overrides);

    if (overrideKeys.length) {
      overrideKeys.forEach((key) => {
        switch (key) {
          case 'title':
            this.title.setTitle(
              `${this.defaultMetaData.title} | ${overrides.title}`
            );

            this.meta.updateTag({
              property: `og:title`,
              content: `${this.defaultMetaData.title} | ${overrides.title}`,
            });

            this.meta.updateTag({
              name: `twitter:title`,
              content: `${this.defaultMetaData.title} | ${overrides.title}`,
            });
            break;
          case 'description':
            this.meta.updateTag({
              name: `description`,
              content: overrides.description ?? '',
            });

            this.meta.updateTag({
              property: `og:description`,
              content: overrides.description ?? '',
            });

            this.meta.updateTag({
              name: `twitter:description`,
              content: overrides.description ?? '',
            });
            break;
          case 'customImg':
            this.meta.updateTag({
              name: `image`,
              content: `${this.defaultMetaData.siteUrl}${overrides.customImg}`,
            });

            this.meta.updateTag({
              name: `og:image`,
              content: `${this.defaultMetaData.siteUrl}${overrides.customImg}`,
            });

            this.meta.updateTag({
              name: `twitter:image`,
              content: `${this.defaultMetaData.siteUrl}${overrides.customImg}`,
            });
            break;
        }
      });
    }
  }

  resetSEO() {
    if (this.defaultMetaData.title) {
      this.title.setTitle(this.defaultMetaData.title);
    }

    const defaultMetaDefinitions: MetaDefinition[] = [
      {
        name: `image`,
        content: `${this.defaultMetaData.siteUrl}${this.defaultSeoImages.ogImg}`,
      },
      {
        name: `description`,
        content: this.defaultMetaData.description ?? '',
      },
      {
        name: `og:image`,
        content: `${this.defaultMetaData.siteUrl}${this.defaultSeoImages.ogImg}`,
      },
      {
        property: `og:url`,
        content: this.defaultMetaData.siteUrl ?? '',
      },
      {
        property: `og:title`,
        content: this.defaultMetaData.title ?? '',
      },
      {
        property: `og:description`,
        content: this.defaultMetaData.description ?? '',
      },
      {
        property: `og:type`,
        content: `website`,
      },
      {
        name: `twitter:image`,
        content: `${this.defaultMetaData.siteUrl}${this.defaultSeoImages.twitterImg}`,
      },
      {
        name: `twitter:domain`,
        content: this.defaultMetaData.siteUrl ?? '',
      },
      {
        name: `twitter:card`,
        content: `summary_large_image`,
      },
      {
        name: `twitter:creator`,
        content:
          this.defaultMetaData.twitterUsername ??
          this.defaultMetaData.author ??
          '',
      },
      {
        name: `twitter:title`,
        content: this.defaultMetaData.title ?? '',
      },
      {
        name: `twitter:description`,
        content: this.defaultMetaData.description ?? '',
      },
    ];

    if (!this.isInitialized) {
      this.isInitialized = true;
      this.meta.addTags(defaultMetaDefinitions);
    } else {
      defaultMetaDefinitions.forEach((metaDefiniton) => {
        this.meta.updateTag(metaDefiniton);
      });
    }
  }
}
