(async () => {
  const Generator = require('generator');
  const generator = new Generator();
  await generator.menu();
  generator.generateProject();
})();
