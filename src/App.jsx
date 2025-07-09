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
  const langMap = useMemo(
    () =>
      bibleData.reduce((map, { translation, language }) => {
        (map[language] ??= []).push(translation);
        return map;
      }, {}),
    []
  );

  // 3️⃣ Sort languages A→Z
  const sortedLanguages = useMemo(
    () => Object.keys(langMap).sort((a, b) => a.localeCompare(b)),
    [langMap]
  );

  // — UI state for mode & selected language
  const [mode, setMode] = useState('translation');
  const [selectedLanguage, setSelectedLanguage] = useState(
    sortedLanguages[0] || ''
  );

  // 4️⃣ Sorted translations for the chosen language
  const languageTranslations = useMemo(
    () =>
      (langMap[selectedLanguage] || []).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' })
      ),
    [langMap, selectedLanguage]
  );

  return (
    // ◀ Flex container with purple background
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',  // change to 'center' to vertical-center too
        minHeight: '100vh',
        padding: '2rem 0',
        backgroundColor: '#6B1A7B',
      }}
    >
      {/* ◀ Constrain to 600px wide */}
      <div style={{ width: '100%', maxWidth: '600px' }}>
        {/* ◀ Heading */}
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '1.5rem',
            color: 'white',        // ensure contrast on purple
          }}
        >
          Contact Information
        </h2>

        {/* ◀ Panel stays white so fields are legible */}
        <div
          className="widecolumn mu_register u-form u-form-vertical u-form-spacing-14"
          style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px' }}
        >
          {/* Mode Switch */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ marginRight: '1rem' }}>
              <input
                type="radio"
                name="mode"
                value="translation"
                checked={mode === 'translation'}
                onChange={() => setMode('translation')}
              />{' '}
              Choose by Translation
            </label>
            <label>
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
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="translationSelect" style={{ display: 'block', marginBottom: '.5rem' }}>
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

          {/* Language → Translations Dropdown */}
          {mode === 'language' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="languageSelect" style={{ display: 'block', marginBottom: '.5rem' }}>
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
              <div>
                <label htmlFor="langTranslationSelect" style={{ display: 'block', marginBottom: '.5rem' }}>
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
    </div>
  );
}

// Shared select styles
const styles = {
  select: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
  },
};


