// assets/js/news.js
// Dynamic client-side news fetch for AI headlines.
// NOTE: This example uses NewsAPI.org as a demonstration. Replace the API URL and key with your chosen provider.

async function loadNews() {
  const apiKey = 'REPLACE_WITH_YOUR_NEWSAPI_KEY'; // <<< replace with your API key or proxy server endpoint
  const q = encodeURIComponent('artificial intelligence OR ai OR "machine learning"');
  const url = `https://newsapi.org/v2/everything?q=${q}&language=en&pageSize=5&sortBy=publishedAt&apiKey=${apiKey}`;

  const list = document.getElementById('news-list');
  if (!list) return;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    list.innerHTML = '';

    if (!data.articles || data.articles.length === 0) {
      list.innerHTML = '<li>No news available right now.</li>';
      return;
    }

    data.articles.forEach(a => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${escapeHtml(a.source.name)}</strong>: <a href="${escapeHtml(a.url)}" target="_blank" rel="noopener">${escapeHtml(a.title)}</a> <span class="text-muted">(${new Date(a.publishedAt).toLocaleDateString()})</span>`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('News load failed', err);
    list.innerHTML = '<li>Unable to load news. Check the API key or proxy.</li>';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNews);
} else {
  loadNews();
}
