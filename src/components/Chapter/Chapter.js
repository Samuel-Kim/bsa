import React, { useState, useEffect, useContext } from 'react';

import { Card } from 'translation-helps-rcl';
import { Verse, ResourcesContext } from 'scripture-resources-rcl';
import { useTranslation } from 'react-i18next';

import { AppContext, ReferenceContext } from '../../context';
import { getVerseText } from '../../helper';
import { CircularProgress } from '@material-ui/core';
import { useCircularStyles } from './style';

import { ContextMenu } from '../../components';
import { useScrollToVerse } from '../../hooks';

const initialPosition = {
  left: null,
  top: null,
};

export default function Chapter({ title, classes, onClose, type, reference }) {
  const { t } = useTranslation();
  const classesCircular = useCircularStyles();
  const [verseRef] = useScrollToVerse('center');
  const { state } = useContext(ResourcesContext);
  const {
    state: { resourcesApp, fontSize },
  } = useContext(AppContext);

  const {
    actions: { goToBookChapterVerse, setReferenceBlock },
  } = useContext(ReferenceContext);

  const [isLoading, setIsLoading] = useState(false);
  const [chapter, setChapter] = useState();
  const [verses, setVerses] = useState();
  const [project, setProject] = useState({});
  const [resource, setResource] = useState(false);
  const [positionContextMenu, setPositionContextMenu] = React.useState(initialPosition);

  const handleContextOpen = (event) => {
    event.preventDefault();
    setPositionContextMenu({
      left: event.clientX - 2,
      top: event.clientY - 4,
    });
  };

  useEffect(() => {
    resourcesApp.forEach((el) => {
      if (el.name === type) {
        setResource(el);
      }
    });
  }, [resourcesApp, type]);

  const resources = state?.resources;
  useEffect(() => {
    if (resources) {
      resources.forEach((el) => {
        if (
          el.repository === resource.name &&
          el.username.toString().toLowerCase() === resource.owner.toString().toLowerCase()
        ) {
          setProject(el.project);
        }
      });
    }
  }, [resources, resource]);

  useEffect(() => {
    let isMounted = true;
    if (project && Object.keys(project).length !== 0) {
      setIsLoading(true);
      project
        .parseUsfm()
        .then((result) => {
          if (result.json && Object.keys(result.json.chapters).length > 0) {
            isMounted && setChapter(result.json.chapters[reference.chapter]);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    } else {
      isMounted && setChapter(null);
      setIsLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [project, reference.chapter]);

  useEffect(() => {
    let _verses = [];
    for (let key in chapter) {
      if (parseInt(key).toString() !== key.toString()) {
        continue;
      }
      const { verseObjects } = chapter[key];
      const verseStyle = {
        fontSize: fontSize + '%',
      };
      const verse = (
        <div
          ref={(ref) => {
            key === reference.verse && verseRef(ref);
          }}
          style={verseStyle}
          className={
            'verse' + (parseInt(key) === parseInt(reference.verse) ? ' current' : '')
          }
          key={key}
          onContextMenu={(e) => {
            setReferenceBlock({
              ...reference,
              resource: type,
              verse: key,
              text: getVerseText(verseObjects),
            });
            handleContextOpen(e);
          }}
          onClick={() =>
            reference.verse !== key
              ? goToBookChapterVerse(reference.bookId, reference.chapter, key)
              : false
          }
        >
          <Verse
            verseKey={key}
            verseObjects={verseObjects}
            paragraphs={false}
            showUnsupported={false}
            disableWordPopover={false}
            reference={{ ...reference, verse: key }}
            renderOffscreen={false}
          />
        </div>
      );
      _verses.push(verse);
    }
    setVerses(_verses);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter, reference, type, fontSize]);

  return (
    <Card
      closeable
      onClose={() => onClose(type)}
      title={title}
      type={type}
      classes={{ ...classes, root: classes.root + ' intro-card' }}
      id={type}
    >
      <ContextMenu position={positionContextMenu} setPosition={setPositionContextMenu} />
      {isLoading || chapter === undefined ? (
        <div className={classesCircular.root}>
          <CircularProgress color="primary" size={100} />
        </div>
      ) : chapter != null ? (
        verses
      ) : (
        t('No_content')
      )}
    </Card>
  );
}
