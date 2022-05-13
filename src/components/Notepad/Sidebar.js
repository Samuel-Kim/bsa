import React from 'react';

const Sidebar = ({ notes, onAddNote, onDeleteNote, activeNote, setActiveNote }) => {
  // const sortedNotes = notes.sort((a, b) => b.lastModified - a.lastModified);

  return (
    <div className="app-sidebar">
      <div className="app-sidebar-header">
        <h1>Notes</h1>
        <button onClick={onAddNote}>Add</button>
      </div>
      <div className="app-sidebar-notes">
        {/* lastModified is always first
        {sortedNotes.map(({ id, title, body, lastModified }, i) => ( */}
        {notes.map(({ id, title, body, lastModified }, i) => (
          // create a dynamic className
          <div
            className={`app-sidebar-note ${id === activeNote && 'active'}`}
            key={i}
            onClick={() => setActiveNote(id)}
          >
            <div className="sidebar-note-title">
              <strong>{title}</strong>
              <button onClick={() => onDeleteNote(id)}>Delete</button>
            </div>
            {/* <p>{body && body.substr(0, 15) + '...'}</p> */}
            <small className="note-meta">
              Last modified{' '}
              {new Date(lastModified).toLocaleDateString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
