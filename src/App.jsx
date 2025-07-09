// src/App.jsx
import React, { useState, useMemo } from 'react';
import bibleData from './bibleData.json';

export default function App() {
  // 1️⃣ Sort all translations A→Z
  const sortedBibleData = useMemo(
    () =>
      [...bibleData].sort((a, b) =>
        a.translation.localeCompare(b.translation, undefined, { sensitivity: 'base' })
      ),
    []
  );

  // 2️⃣ Group translations by language
  const langMap = useMemo(() => {
    return bibleData.reduce((map, { translation, language }) => {
      (map[language] ??= []).push(translation);
      return map;
    }, {});
  }, []);

  // 3️⃣ Sort languages A→Z
  const sortedLanguages = useMemo(
    () => Object.keys(langMap).sort((a, b) => a.localeCompare(b)),
    [langMap]
  );

  // — UI state for mode & selected language
  const [mode, setMode] = useState('translation');
  const [selectedLanguage, setSelectedLanguage] = useState(sortedLanguages[0] || '');

  // 4️⃣ Sorted translations for the chosen language
  const languageTranslations = useMemo(
    () =>
      (langMap[selectedLanguage] || []).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' })
      ),
    [langMap, selectedLanguage]
  );

  return (
    <div style={styles.page}>
      {/* Centered panel now up to 1140px wide */}
      <div style={styles.panel}>
        {/* Mode Switch */}
        <div style={styles.field}>
          <label style={styles.label}>
            <input
              type="radio"
              name="mode"
              value="translation"
              checked={mode === 'translation'}
              onChange={() => setMode('translation')}
            />{' '}
            Choose by Translation
          </label>
          <label style={{ ...styles.label, marginLeft: '1.5rem' }}>
            <input
              type="radio"
              name="mode"
              value="language"
              checked={mode === 'language'}
              onChange={() => setMode('language')}
            />{' '}
            Choose by Language
          </label>
        </div>

        {/* Translation Dropdown */}
        {mode === 'translation' && (
          <div style={styles.field}>
            <label htmlFor="translationSelect" style={styles.label}>
              Translation (with Language):
            </label>
            <select id="translationSelect" style={styles.select}>
              {sortedBibleData.map(({ translation, language }) => (
                <option key={translation} value={translation}>
                  {`${translation} (${language})`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Language → Translations Dropdowns */}
        {mode === 'language' && (
          <>
            <div style={styles.field}>
              <label htmlFor="languageSelect" style={styles.label}>
                Language:
              </label>
              <select
                id="languageSelect"
                style={styles.select}
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {sortedLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label htmlFor="langTranslationSelect" style={styles.label}>
                Translations for “{selectedLanguage}”:
              </label>
              <select id="langTranslationSelect" style={styles.select}>
                {languageTranslations.map((trans) => (
                  <option key={trans} value={trans}>
                    {trans}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#6B1A7B',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // or 'center' for vertical centering
    padding: '2rem 0',
    boxSizing: 'border-box',
  },
  panel: {
    width: '100%',
    maxWidth: '1140px',  // <— now up to 1140px wide
    backgroundColor: 'transparent',
    padding: '0 1rem',   // optional inner padding
  },
  field: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'inline-block',
    color: 'white',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  select: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    backgroundColor: '#6B1A7B',
    color: 'white',
    border: '1px solid #fff',
    borderRadius: '4px',
    marginTop: '0.25rem',
  },
};






