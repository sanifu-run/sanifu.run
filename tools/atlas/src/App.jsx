import { useEffect, useRef, useState } from 'react';

export function App() {
  const stage = useRef(null);
  const gallery = useRef(null);
  const [listOpen, setListOpen] = useState(false);
  const [activeYear, setActiveYear] = useState(null);
  const [selected, setSelected] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const resultsList = useRef(null);
  const [count, setCount] = useState(null);
  const [status, setStatus] = useState('Opening the gallery…');
  useEffect(() => {
    const controller = new AbortController();
    let alive = true;
    let repositoryDataReady = false;
    const dataRequest = fetch(`${import.meta.env.BASE_URL}atlas.json`, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Repository data could not be loaded.');
        return response.json();
      })
    Promise.all([dataRequest, import('./gallery')])
      .then(async ([data, { createGallery }]) => {
        if (!alive) return;
        if (!Array.isArray(data.nodes)) throw new Error('Repository data is unavailable.');
        setCount(data.nodes.filter(node => node.type === 'repository').length);
        // Let the heading and loading feedback paint before WebGL initialization.
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        if (!alive) return;
        setRepositories(data.nodes.filter(node => node.type === 'repository'));
        repositoryDataReady = true;
        gallery.current = createGallery(stage.current, data.nodes, setSelected, setActiveYear);
        setStatus('');
      })
      .catch(error => {
        if (!alive || error.name === 'AbortError') return;
        setStatus(repositoryDataReady ? 'The 3D view could not open. Choose Browse list to explore the repositories.' : 'Repository data could not load. Please reload the page.');
        console.error('Atlas gallery:', error);
      });
    return () => {
      alive = false;
      controller.abort();
      gallery.current?.destroy();
      gallery.current = null;
    };
  }, []);

  const yearCounts = repositories.reduce((counts, repo) => { const year = repo.created_at?.slice(0,4) ?? 'Unknown date'; counts[year] = (counts[year] ?? 0) + 1; return counts; }, {});
  const years = Object.keys(yearCounts).sort();
  const visibleCount = activeYear === null ? count : yearCounts[activeYear];

  const searchTerm = query.trim().toLowerCase();
  const matches = searchTerm ? repositories.filter(repo =>
    `${repo.owner}/${repo.label}`.toLowerCase().includes(searchTerm)
  ).sort((a, b) => {
    const rank = repo => repo.label.toLowerCase() === searchTerm ? 0 : repo.label.toLowerCase().startsWith(searchTerm) ? 1 : 2;
    return rank(a) - rank(b) || `${a.owner}/${a.label}`.localeCompare(`${b.owner}/${b.label}`);
  }) : [];
  const showResults = searchOpen && Boolean(searchTerm);

  useEffect(() => {
    if (showResults) resultsList.current?.children[activeResult]?.scrollIntoView({block:'nearest'});
  }, [activeResult, showResults, query]);

  function findRepository(repo) {
    gallery.current?.select(repo.id);
    setSelected(repo);
    setListOpen(false);
    setQuery(`${repo.owner}/${repo.label}`);
    setSearchOpen(false);
    stage.current?.querySelector('canvas')?.focus();
  }

  function searchKeyDown(event) {
    if (event.key === 'Escape') { setSearchOpen(false); return; }
    if (!matches.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setSearchOpen(true);
      setActiveResult(index => (index + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      findRepository(matches[Math.min(activeResult, matches.length-1)]);
    }
  }

  function overview() {
    setSelected(null);
    gallery.current?.reset();
    stage.current?.querySelector('canvas')?.focus();
  }

  return (
    <main className={`gallery-page${listOpen ? ' list-open' : ''}`}>
      <div ref={stage} className="stage" aria-label="Interactive repository gallery" />
      <header className="intro">
        <a className="brand" href="/" aria-label="Sanifu home">
          <img src="/assets/brand/sanifu-logo-approved.png" alt="sanifu" />
        </a>
        <p className="eyebrow">Repositories started by David Ndungu</p>
        <h1>The Atlas</h1>
        <p>{count === null ? 'The repositories I started.' : `${visibleCount} ${visibleCount === 1 ? 'repository' : 'repositories'} I started${activeYear ? ` in ${activeYear}` : ''}.`}</p>
        <p className="byline">Choose a year. Find a project. Explore its source.</p>
      </header>
      <div className="page-actions"><a href="/">Back to Sanifu</a><button type="button" aria-pressed={listOpen} onClick={() => setListOpen(!listOpen)}>{listOpen ? 'Graph view' : 'Browse list'}</button></div>
      <div className="repo-search" role="search" aria-label="Find a repository">
        <input type="search" role="combobox" aria-label="Search repositories"
          placeholder="Find a repository…" autoComplete="off" spellCheck="false"
          disabled={!repositories.length} value={query}
          aria-expanded={showResults} aria-controls="repo-search-results"
          aria-autocomplete="list"
          aria-activedescendant={showResults && matches.length ? `repo-search-option-${activeResult}` : undefined}
          onChange={event => {setQuery(event.target.value);setActiveResult(0);setSearchOpen(true);}}
          onFocus={() => setSearchOpen(true)} onBlur={() => setSearchOpen(false)}
          onKeyDown={searchKeyDown} />
        {showResults && <div className="search-results">
          <p className="search-count" role="status">{matches.length ? `${matches.length} ${matches.length === 1 ? 'repository' : 'repositories'} found` : 'No repositories found. Try a name or owner.'}</p>
          <ul id="repo-search-results" role="listbox" aria-label="Matching repositories" ref={resultsList}>
            {matches.map((repo,index) => <li key={repo.id} id={`repo-search-option-${index}`}
              role="option" aria-selected={index === activeResult}
              onMouseDown={event => event.preventDefault()}
              onClick={() => findRepository(repo)}>
              <span>{repo.owner}/{repo.label}</span><small>{repo.language || 'Repo'}</small>
            </li>)}
          </ul>
        </div>}
      </div>
      {listOpen && <section className="repo-list" aria-label="Repository list"><h2>{activeYear ?? 'All years'}</h2><p>{visibleCount} public {visibleCount === 1 ? 'repository' : 'repositories'}</p><ul>{repositories.filter(repo => activeYear === null || repo.created_at?.slice(0,4) === activeYear).map(repo => <li key={repo.id}><button onClick={() => findRepository(repo)}><strong>{repo.owner}/{repo.label}</strong><span>{repo.language || 'No language data'}</span></button><a href={repo.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${repo.owner}/${repo.label} on GitHub`}>Source</a></li>)}</ul></section>}
      {status && <p className="status" role="status">{status}</p>}
      {selected && !listOpen && (
        <section className="repository-detail" aria-live="polite" aria-label="Selected project">
          <p className="owner">Started by David Ndungu</p>
          <h2>{selected.owner}/{selected.label}</h2>
          <p className="description">{selected.description || 'An original project. Explore the source on GitHub.'}</p>
          <p className="metadata">{[selected.language, selected.created_at && new Date(selected.created_at).toLocaleDateString(undefined, {year:'numeric', month:'short', day:'numeric', timeZone:'UTC'}), Number.isFinite(selected.commit_count) && `${selected.commit_count.toLocaleString()} ${selected.commit_count === 1 ? 'commit' : 'commits'}`].filter(Boolean).join(' · ')}</p>
          <div className="detail-actions">
            <a href={selected.url} target="_blank" rel="noopener noreferrer">View on GitHub</a>
            <button onClick={overview}>Back to the gallery</button>
          </div>
        </section>
      )}
      <a className="artwork-credits" href={`${import.meta.env.BASE_URL}languages/credits.html`} target="_blank" rel="noreferrer">Gopher: Renee French · Artwork credits</a>
      <nav className="year-navigation" aria-label="Repository years">
        <button className="all-years" aria-pressed={activeYear === null} onClick={() => gallery.current?.setYear(null)}>All years</button>
        <div className="year-track">
          {years.map(year => <button key={year} className="year-node" aria-label={`Show ${year} repositories`} aria-pressed={activeYear === year} title={`${yearCounts[year]} repositories`} onClick={() => gallery.current?.setYear(year)}><span className="year-orb" /><span>{year}</span></button>)}
        </div>
      </nav>
      <div className="view-controls" aria-label="Graph view controls"><button onClick={() => gallery.current?.zoom(.8)} aria-label="Zoom in">+</button><button onClick={() => gallery.current?.zoom(1.25)} aria-label="Zoom out">−</button><button onClick={() => gallery.current?.reset()}>Reset view</button></div>
      <footer className="instructions"><span className="gesture-desktop">Drag to rotate · Shift-drag to pan · Scroll to zoom</span><span className="gesture-mobile">One finger rotates · Two fingers pan or zoom</span><span>{activeYear ? `${activeYear} · All years to zoom out` : 'Click a year to explore · Size = commits · Art = language'}</span></footer>
    </main>
  );
}
