export const parseEditorContent = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const img = doc.querySelector('img');
  const cover = img?.getAttribute('src');
  img?.remove();

  doc.body.querySelectorAll('p').forEach((p) => {
    if (!p.textContent?.trim() && !p.querySelector('*')) {
      p.remove();
    }
  });

  const content = doc.body.innerHTML.trim();
  return { cover, content };
};
