// src/App.jsx
import React, { useState, useMemo } from 'react';
import bibleData from './bibleData.json';

export default function App() {
  // 1️⃣ Sort all translations A→Z
  const sortedBibleData = useMemo(() =>
    [...bibleData].sort((a, b) =>
      a.translation.localeCompare(b.translation, undefined, { sensitivity: 'base' })
    )
  , []);

  // 2️⃣ Group by language
  const langMap = useMemo(() => {
    return bibleData.reduce((map, { translation, language }) => {
      (map[language] ??= []).push(translation);
      return map;
    }, {});
  }, []);

  // 3️⃣ Sorted list of languages
  const sortedLanguages = useMemo(
    () => Object.keys(langMap).sort((a, b) => a.localeCompare(b)),
    [langMap]
  );

  // UI state
  const [mode, setMode] = useState('translation');
  const [selectedLanguage, setSelectedLanguage] = useState(sortedLanguages[0] || '');

  // 4️⃣ Translations for the selected language
  const languageTranslations = useMemo(
    () => (langMap[selectedLanguage] || []).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    ),
    [langMap, selectedLanguage]
  );

  return (
    // ◀ Full‐viewport purple background
    <div style={styles.page}>
      {/* ◀ Fixed‐width panel */}
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
          <label style={{ ...styles.label, marginLeft: '2rem' }}>
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
                onChange={e => setSelectedLanguage(e.target.value)}
              >
                {sortedLanguages.map(lang => (
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
                {languageTranslations.map(trans => (
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
    width: '100vw',            // ensure it spans full viewport width
    display: 'flex',
    justifyContent: 'center',  // center the panel horizontally
    alignItems: 'flex-start',  // or 'center' to vertical‐center
    padding: '2rem 0',
    boxSizing: 'border-box',
    margin: 0,
  },
  panel: {
    width: '100%',            // take up all available up to maxWidth
    maxWidth: '1140px',       // fixed max width of 1140px
    boxSizing: 'border-box',
    padding: '1rem',
  },
  field: {
    marginBottom: '1.5rem',
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
    display: 'inline-block',
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
    marginTop: '0.5rem',
    boxSizing: 'border-box',
  },
};







