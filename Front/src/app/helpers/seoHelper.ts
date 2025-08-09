// helpers/seo.helper.ts
import { Meta, Title } from '@angular/platform-browser';

export class SeoHelper {
  constructor(private title: Title, private meta: Meta) {}

  updateMeta(config: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
  }) {
    if (config.title) {
      this.title.setTitle(config.title);
      this.meta.updateTag({ name: 'og:title', content: config.title });
    }

    if (config.description) {
      this.meta.updateTag({ name: 'description', content: config.description });
      this.meta.updateTag({ name: 'og:description', content: config.description });
    }

    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    if (config.image) {
      this.meta.updateTag({ name: 'og:image', content: config.image });
    }

    if (config.url) {
      this.meta.updateTag({ name: 'og:url', content: config.url });
    }
  }
}
