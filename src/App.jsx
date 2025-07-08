// src/App.jsx
import React, { useState, useMemo } from 'react';
import bibleData from './bibleData.json';

export default function App() {
  // 1️⃣ Sorted list of all translations (A→Z)
  const sortedBibleData = useMemo(
    () =>
      [...bibleData].sort((a, b) =>
        a.translation.localeCompare(b.translation, undefined, { sensitivity: 'base' })
      ),
    []
  );

  // 2️⃣ Map: language → [translations…]
  const langMap = useMemo(() => {
    return bibleData.reduce((map, { translation, language }) => {
      (map[language] ??= []).push(translation);
      return map;
    }, {});
  }, []);

  // 3️⃣ Sorted list of languages (A→Z)
  const sortedLanguages = useMemo(
    () => Object.keys(langMap).sort((a, b) => a.localeCompare(b)),
    [langMap]
  );

  // — UI state for mode & selected language
  const [mode, setMode] = useState('translation');                   // "translation" or "language"
  const [selectedLanguage, setSelectedLanguage] = useState(
    sortedLanguages[0] || ''
  );

  // 4️⃣ For the selected language, a sorted array of its translations
  const languageTranslations = useMemo(
    () =>
      (langMap[selectedLanguage] || []).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' })
      ),
    [langMap, selectedLanguage]
  );

  return (
    <div style={styles.container}>
      {/* Mode Switch */}
      <div style={styles.field}>
        <label>
          <input
            type="radio"
            name="mode"
            value="translation"
            checked={mode === 'translation'}
            onChange={() => setMode('translation')}
          />{' '}
          Choose by Translation
        </label>
        <label style={{ marginLeft: '1rem' }}>
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
          <label htmlFor="translationSelect">Translation (with Language):</label>
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
            <label htmlFor="languageSelect">Language:</label>
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
            <label htmlFor="langTranslationSelect">
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
  );
}

// Simple inline styles
const styles = {
  container: {
    padding: '1rem',
    fontFamily: 'sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
  },
  field: {
    marginBottom: '1rem',
  },
  select: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    marginTop: '0.25rem',
  },
};



