/**
 * 11ty configuration — the build pipeline.
 * All collections, filters, and shortcodes are defined here.
 * Templates receive pre-sorted data; no sorting logic in templates.
 */

module.exports = function (eleventyConfig) {
  /* ------------------------------------------------------------------ */
  /*  Passthrough copy — static assets are copied verbatim              */
  /* ------------------------------------------------------------------ */
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");

  /* ------------------------------------------------------------------ */
  /*  Collections                                                        */
  /* ------------------------------------------------------------------ */

  // All blog posts, sorted by date descending
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Unique tag list from all posts (custom, avoids override of built-in tagList)
  eleventyConfig.addCollection("allTags", function (collectionApi) {
    const posts = collectionApi.getFilteredByGlob("src/posts/*.md");
    const tagSet = new Set();
    for (const post of posts) {
      const tags = post.data.tags || [];
      for (const tag of tags) {
        tagSet.add(tag);
      }
    }
    return [...tagSet].sort();
  });

  /* ------------------------------------------------------------------ */
  /*  Filters                                                            */
  /* ------------------------------------------------------------------ */

  // Format a Date object according to the site's locale
  eleventyConfig.addFilter("formatDate", function (date, dateFormat) {
    const locale = (dateFormat && dateFormat.locale) || "zh-CN";
    const options = (dateFormat && dateFormat.options) || {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    try {
      return new Intl.DateTimeFormat(locale, options).format(new Date(date));
    } catch (_e) {
      return String(date);
    }
  });

  // ISO date string for <time datetime="...">
  eleventyConfig.addFilter("isoDate", function (date) {
    try {
      return new Date(date).toISOString();
    } catch (_e) {
      return "";
    }
  });

  // Take first N items from an array
  eleventyConfig.addFilter("first", function (arr, count) {
    if (!Array.isArray(arr)) return [];
    return arr.slice(0, count);
  });

  // Slug that preserves non-Latin characters (Chinese, Japanese, etc.)
  eleventyConfig.addFilter("slug", function (str) {
    if (typeof str !== "string") return "";
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w一-鿿぀-ゟ゠-ヿ가-힯-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  });

  /* ------------------------------------------------------------------ */
  /*  Shortcodes                                                         */
  /* ------------------------------------------------------------------ */

  // Current year (for footer copyright)
  eleventyConfig.addShortcode("currentYear", function () {
    return String(new Date().getFullYear());
  });

  /* ------------------------------------------------------------------ */
  /*  Return                                                             */
  /* ------------------------------------------------------------------ */
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    pathPrefix: "/blog/",
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
