// Analytics externo (Umami) removido no MediaLake: sem contagem de visualizações.
async function getStatsByPath() {
  return { pageviews: undefined, visitors: undefined, visits: undefined };
}

export default Object.freeze({ getStatsByPath });
