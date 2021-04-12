import React, { useState, useContext } from 'react';

import { AppContext } from '../../App.context';
import { BookSelect, ChapterSelect } from '../../components';

import { AppBar, Toolbar, Fab, MenuItem, Menu } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { useTranslation } from 'react-i18next';

import { getUniqueResources } from '../../helper';

function SubMenuBar() {
  const { state, actions } = useContext(AppContext);
  const { appConfig } = state;
  const { setAppConfig } = actions;

  const [anchorEl, setAnchorEl] = useState(null);

  const uniqueResources = getUniqueResources(appConfig);
  const { t } = useTranslation();

  const handleAddNew = (item) => {
    setAppConfig((prev) => prev.concat({ w: 4, h: 4, x: 0, y: 99, i: item, minH : 2, minW: 2 }));

    handleClose();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <Toolbar>
            <Fab color="primary" aria-label="add" onClick={handleClick}>
              <AddIcon />
            </Fab>
            <Menu
              color="transparent"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {Object.keys(uniqueResources).map((keyName, index) => (
                <MenuItem key={index} onClick={() => handleAddNew(keyName)}>
                  {t(keyName)}
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
          <Toolbar style={{ margin: '0 auto' }}>
            <BookSelect />
            <ChapterSelect />
          </Toolbar>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default SubMenuBar;
