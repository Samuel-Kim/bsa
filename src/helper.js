export const getResources = (appConfig, resourcesApp) => {
  const resources = [];
  if (appConfig.length > 0) {
    appConfig.forEach((el) => {
      resourcesApp.forEach((r_el) => {
        if (
          r_el?.subject &&
          [
            'Bible',
            'Aligned Bible',
            'Hebrew Old Testament',
            'Greek New Testament',
          ].includes(r_el.subject) &&
          r_el.name === el.i
        ) {
          resources.push(r_el.link);
        }
      });
    });
  }
  return resources;
};

export const getBookList = (bibleList, t) => {
  const result = [];
  bibleList.forEach((el) => {
    result.push({ key: el.identifier, name: t(el.identifier), label: t(el.identifier) });
  });
  return result;
};

export const getUniqueResources = (appConfig, resourcesApp) => {
  if (appConfig.length === 0) {
    return resourcesApp;
  }
  const opened = appConfig.map((el) => el.i);
  return resourcesApp.filter((el) => !opened.includes(el.name));
};

// +
const getText = (verseObject) => {
  return verseObject.text || verseObject.nextChar || '';
};

// +
const getFootnote = (verseObject) => {
  return '/fn ' + verseObject.content + ' fn/';
};

// +
const getMilestone = (verseObject, showUnsupported) => {
  const { tag, children } = verseObject;

  switch (tag) {
    case 'k':
      return children.map((child) => getObject(child, showUnsupported)).join(' ');
    case 'zaln':
      if (children.length === 1 && children[0].type === 'milestone') {
        return getObject(children[0], showUnsupported);
      } else {
        return getAlignedWords(children);
      }
    default:
      return '';
  }
};

// +
const getAlignedWords = (verseObjects) => {
  return verseObjects
    .map((verseObject) => {
      return getWord(verseObject);
    })
    .join('');
};

// +
const getSection = (verseObject) => {
  return verseObject.content;
};

// +
const getUnsupported = (verseObject) => {
  return (
    '/' +
    verseObject.tag +
    ' ' +
    (verseObject.content || verseObject.text) +
    ' ' +
    verseObject.tag +
    '/'
  );
};

// +
const getWord = (verseObject) => {
  return verseObject.text || verseObject.content;
};

export const getVerseText = (verseObjects, showUnsupported = false) => {
  return verseObjects
    .map((verseObject) => getObject(verseObject, showUnsupported))
    .join('');
};

const getObject = (verseObject, showUnsupported) => {
  const { type } = verseObject;

  switch (type) {
    case 'quote':
    case 'text':
      return getText(verseObject);
    case 'milestone':
      return getMilestone(verseObject, showUnsupported);
    case 'word':
      if (verseObject.strong) {
        return getAlignedWords([verseObject]);
      } else {
        return getWord(verseObject);
      }
    case 'section':
      return getSection(verseObject);
    case 'paragraph':
      return '\n';
    case 'footnote':
      return getFootnote(verseObject);
    default:
      if (showUnsupported) {
        return getUnsupported(verseObject);
      } else {
        return '';
      }
  }
};

export const langArrToObject = (langs) => {
  let result = {};
  langs.forEach((el) => {
    result[el] = { translation: require(`./config/locales/${el}/translation.json`) };
  });
  return result;
};
/**
 *
 * @param {string} el Name
 * @param {*} val default value
 * @param {string} type is string or object or bool
 * @param {string} ext if value is object, check element
 * @returns
 */
export const checkLSVal = (el, val, type = 'string', ext = false) => {
  let value;
  switch (type) {
    case 'object':
      try {
        value = JSON.parse(localStorage.getItem(el));
      } catch (error) {
        localStorage.setItem(el, JSON.stringify(val));
        return val;
      }
      break;
    case 'boolean':
      if (localStorage.getItem(el) === null) {
        value = null;
      } else {
        value = localStorage.getItem(el) === 'true';
      }
      break;

    case 'string':
    default:
      value = localStorage.getItem(el);
      break;
  }

  if (value === null || (ext && !value[ext])) {
    localStorage.setItem(el, type === 'string' ? val : JSON.stringify(val));
    return val;
  } else {
    return value;
  }
};


export const switchModeBible = (type, goToBookChapterVerse, setAppConfig) => {
  const curRef = JSON.parse(localStorage.getItem('reference'))[type];
  const appConfig = JSON.parse(localStorage.getItem('appConfig'))[type];
  setAppConfig(appConfig);
  goToBookChapterVerse(curRef.bookId, curRef.chapter, curRef.verse);
};
