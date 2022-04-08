import React, { useEffect, useState, useContext } from 'react';

import { Verse } from 'scripture-resources-rcl';
import { Box, CircularProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { AppContext, ReferenceContext } from '../../context';
import { ContextMenu } from '../../components';
import { useScrollToVerse } from '../../hooks/useScrollToVerse';

import { getVerseText } from '../../helper';

import { useCircularStyles, useNoContentStyles } from './style';

const initialPosition = {
  left: null,
  top: null,
};

function USFMContent({ reference, content, type, fontSize }) {
  const { t } = useTranslation();
  const [verses, setVerses] = useState();
  const [chapter, setChapter] = useState();
  const [positionContextMenu, setPositionContextMenu] = useState(initialPosition);
  const [verseRef] = useScrollToVerse('center');
  const classesCircular = useCircularStyles();
  const classesNoContent = useNoContentStyles();
  const resource = content.resource;
  const resourceLink = resource?.resourceLink;
  const { contentNotFoundError, error, loading } = content.resourceStatus;

  const {
    actions: { setReferenceBlock, goToBookChapterVerse },
    state: { chunks },
  } = useContext(ReferenceContext);

  const {
    state: { switchChunks, switchWordPopover },
  } = useContext(AppContext);

  useEffect(() => {
    let isMounted = true;
    if (resource?.project && Object.keys(resource.project).length !== 0) {
      resource.project
        .parseUsfm()
        .then((result) => {
          if (isMounted) {
            if (Object.keys(result.json.chapters).length > 0) {
              setChapter(result.json.chapters[reference.chapter]);
            }
          }
        })
        .catch((error) => console.log(error));
    } else {
      setChapter(null);
    }
    return () => {
      // clean up
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceLink, reference.chapter]);

  useEffect(() => {
    const handleContextMenu = (e, key, verseObjects) => {
      e.preventDefault();
      setReferenceBlock({
        ...reference,
        resource: type,
        verse: key,
        text: getVerseText(verseObjects),
      });
      setPositionContextMenu({
        left: e.clientX - 2,
        top: e.clientY - 4,
      });
    };

    let _verses = [];
    for (let key in chapter) {
      if (parseInt(key).toString() !== key.toString()) {
        continue;
      }
      const { verseObjects } = chapter[key];

      const verseStyle = {
        fontSize: fontSize + '%',
      };
      const handleClick = () => {
        if (reference.verse !== key) {
          goToBookChapterVerse(reference.bookId, reference.chapter, key);
        }
      };
      if (reference.verse === key) {
        localStorage.setItem(type, getVerseText(verseObjects));
      }

      const verse = (
        <Box
          ref={(ref) => {
            key.toString() === reference.verse.toString() && verseRef(ref);
          }}
          style={verseStyle}
          className={'verse'}
          bgcolor={key.toString() === reference.verse.toString() ? 'primary.select' : ''}
          key={key}
          onContextMenu={(e) => handleContextMenu(e, key, verseObjects)}
          onClick={handleClick}
        >
          {switchChunks && chunks.includes(key.toString()) && <p />}
          <Verse
            verseKey={key}
            verseObjects={verseObjects}
            paragraphs={false}
            showUnsupported={false}
            disableWordPopover={switchWordPopover}
            reference={{ ...reference, verse: key }}
            renderOffscreen={false}
          />
        </Box>
      );

      _verses.push(verse);
    }
    setVerses(_verses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter, reference, type, fontSize, switchChunks, chunks, switchWordPopover]);

  const loadingContent = (
    <div className={classesCircular.root}>
      <CircularProgress color="primary" size={100} />
    </div>
  );
  const noContent = <div className={classesNoContent.root}>{t('No_content')}</div>;

  const usfmContent = loading
    ? loadingContent
    : !contentNotFoundError || !error
    ? verses
    : noContent;

  return (
    <>
      {usfmContent}
      <ContextMenu position={positionContextMenu} setPosition={setPositionContextMenu} />
    </>
  );
}

export default USFMContent;
