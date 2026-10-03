// Keep the teaching material readable if a module fails to load.
import('./app.js').catch(() => {
  const host = document.getElementById('scene');
  host.replaceChildren();
  const message = document.createElement('p');
  message.className = 'load-error';
  message.textContent = 'The interactive map could not start. The process summary remains available below. Reload this page to try the interactive map again.';
  const link = document.createElement('a');
  link.href = '../';
  link.textContent = 'Explore Sanifu →';
  link.className = 'load-error-link';
  host.append(message, link);
  document.querySelectorAll('button').forEach(button => { button.disabled = true; });
  document.getElementById('process-summary').hidden = false;
});
