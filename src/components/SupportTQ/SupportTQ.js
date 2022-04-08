import React, { useEffect } from 'react';

import { Card, CardContent, useContent, useCardState } from 'translation-helps-rcl';

export default function SupportTQ({
  title,
  classes,
  onClose,
  type,
  server,
  fontSize,
  reference: { bookId, chapter, verse },
  resource,
}) {
  const mdContent = {
    projectId: bookId,
    ref: resource.branch ?? 'master',
    languageId: resource.languageId ?? 'ru',
    resourceId: 'tq',
    filePath:
      String(chapter).padStart(2, '0') + '/' + String(verse).padStart(2, '0') + '.md',
    owner: resource.owner ?? 'door43-catalog',
    server,
  };
  const tsvContent = {
    verse: String(verse),
    chapter: String(chapter),
    projectId: bookId,
    ref: resource.branch ?? 'master',
    languageId: resource.languageId ?? 'ru',
    resourceId: 'tq',
    owner: resource.owner ?? 'door43-catalog',
    server,
  };
  const data = useContent(
    resource.subject === 'TSV Translation Questions'
      ? { ...tsvContent }
      : { ...mdContent }
  );
  const {
    markdown,
    items,
    resourceStatus,
    props: { languageId },
  } = data;
  const { loading } = resourceStatus;
  console.log(data);

  const {
    state: { item, headers, filters, itemIndex, markdownView },
    actions: { setFilters, setItemIndex, setMarkdownView },
  } = useCardState({
    items,
  });

  useEffect(() => {
    if (item) {
      localStorage.setItem(type, '__' + item.Question + '__\n\n' + item.Response);
      localStorage.setItem('index', type + '_' + itemIndex);
    }
  }, [item, itemIndex, type]);

  return (
    <Card
      closeable
      title={title}
      onClose={() => onClose(type)}
      classes={{ ...classes, children: 'tqcard' }}
      id={type}
      items={items}
      headers={headers}
      filters={filters}
      fontSize={fontSize}
      itemIndex={itemIndex}
      setFilters={setFilters}
      setItemIndex={setItemIndex}
      markdownView={markdownView}
      setMarkdownView={setMarkdownView}
      showSaveChangesPrompt={() => {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }}
    >
      <CardContent
        item={item}
        filters={filters}
        fontSize={fontSize}
        markdown={markdown}
        viewMode="question"
        isLoading={Boolean(loading)}
        languageId={languageId}
        markdownView={markdownView}
      />
    </Card>
  );
}
