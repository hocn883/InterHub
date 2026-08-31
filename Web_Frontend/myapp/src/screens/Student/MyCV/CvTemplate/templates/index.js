const templateContext = require.context(
  "./",
  true,
  /Template\.(js|jsx)$/
);

const templates = templateContext
  .keys()
  .map((path, index) => {
    const module = templateContext(path);

    const Component = module.default;

    if (!Component) {
      return null;
    }

    // Ví dụ:
    // ./ModernTemplate/ModernTemplate.jsx
    // => ModernTemplate
    const folderName =
      path.split("/")[1] || `Template${index + 1}`;

    const defaultId = folderName
      .replace(/Template$/i, "")
      .toLowerCase();

    const defaultName = folderName
      .replace(/Template$/i, "")
      .replace(/([a-z])([A-Z])/g, "$1 $2");

    return {
      id:
        module.templateInfo?.id ||
        defaultId,

      name:
        module.templateInfo?.name ||
        defaultName,

      description:
        module.templateInfo?.description ||
        "Mẫu CV",

      previewColor:
        module.templateInfo?.previewColor ||
        "#2563eb",

      order:
        module.templateInfo?.order ??
        index + 1,

      component: Component,
    };
  })
  .filter(Boolean)
  .sort(
    (a, b) =>
      a.order - b.order
  );

console.log(
  "TEMPLATES LOADED:",
  templates
);

export default templates;