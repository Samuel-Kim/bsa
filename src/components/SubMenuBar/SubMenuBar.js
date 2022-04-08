import React, { useContext, useRef, useState } from 'react';

import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { AppContext } from '../../context';
import {
  About,
  BookSelect,
  ChapterSelect,
  FeedbackDialog,
  ProjectorAdd,
  SearchResources,
  SelectLanguage,
  SelectModeBible,
  Settings,
  ShowReference,
  WorkspaceManager,
} from '../../components';

import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';

import { useModalStyles, useStyles } from './style';

import LogoOBT from './logo_obt.png';
import LogoTT from './logo_tt.png';

function SubMenuBar() {
  const {
    state: { loadIntro, openMainMenu, theme },
    actions: { setLoadIntro },
  } = useContext(AppContext);

  const { t } = useTranslation();

  const menuRef = useRef(null);

  const [anchorMainMenu, setAnchorMainMenu] = useState(null);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [anchorAddMaterial, setAnchorAddMaterial] = useState(null);
  const [openAbout, setOpenAbout] = useState(false);

  const classes = useStyles();
  const modalClasses = useModalStyles();

  const handleClickAddMaterial = (event) => {
    setAnchorAddMaterial(event.currentTarget);
    handleCloseMainMenu();
  };
  const handleClickMainMenu = (event) => {
    setAnchorMainMenu(event.currentTarget);
  };

  const handleCloseMainMenu = () => {
    setAnchorMainMenu(null);
  };
  const handleCloseAddMaterial = () => {
    setAnchorAddMaterial(null);
  };
  const handleOpenUsersGuide = () => {
    setLoadIntro(true);
    handleCloseMainMenu();
  };
  const handleClickOpenAbout = () => {
    setOpenAbout(true);
  };
  const handleOpenFeedbackDialog = () => {
    setOpenFeedbackDialog(true);
    handleCloseMainMenu();
  };
  const handleCloseFeedbackDialog = () => {
    setOpenFeedbackDialog(false);
  };

  const anchorEl = loadIntro && anchorMainMenu ? anchorMainMenu : menuRef.current;

  return (
    <AppBar className={'intro-appBar'} position="relative">
      <Toolbar className={classes.grow}>
        <Box
          component="img"
          sx={{
            height: 64,
          }}
          alt="Open Bible Text"
          src={theme === 'obt' ? LogoOBT : LogoTT}
        />

        <div className={classes.centerButtons}>
          <SelectModeBible />
          <ShowReference />
          <ChapterSelect />
          <BookSelect />
        </div>

        <IconButton
          ref={menuRef}
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleClickMainMenu}
        >
          <MenuIcon />
        </IconButton>

        <Menu
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorMainMenu) || openMainMenu}
          onClose={handleCloseMainMenu}
          classes={modalClasses}
          PopoverClasses={{ paper: 'intro-hamburger' }}
        >
          <MenuItem button={false} divider={true}>
            <Button
              startIcon={<AddIcon size={'small'} />}
              onClick={handleClickAddMaterial}
              variant="contained"
              color="secondary"
              size="small"
              fullWidth
            >
              {t('Add_resources')}
            </Button>
          </MenuItem>

          <WorkspaceManager onClose={handleCloseMainMenu} />

          <MenuItem button={false} divider={true}>
            <SelectLanguage label={t('Interface_lang')} />
          </MenuItem>

          <Settings setAnchorMainMenu={setAnchorMainMenu} />

          <MenuItem onClick={handleOpenFeedbackDialog} divider={true}>
            {t('Feedback')}
          </MenuItem>

          <FeedbackDialog
            handleCloseDialog={handleCloseFeedbackDialog}
            openFeedbackDialog={openFeedbackDialog}
            title={t('Write_us')}
          />

          <ProjectorAdd handleCloseMainMenu={handleCloseMainMenu} />

          <MenuItem onClick={handleOpenUsersGuide} divider={true}>
            {t('User_guide')}
          </MenuItem>

          <MenuItem button={false} divider={true}>
            <p className={classes.menu}>{t('Text_under_checkbox_error')}</p>
          </MenuItem>

          <About
            open={openAbout}
            setOpen={setOpenAbout}
            handleClick={handleClickOpenAbout}
          />
        </Menu>
        <SearchResources
          anchorEl={anchorAddMaterial}
          onClose={handleCloseAddMaterial}
          open={Boolean(anchorAddMaterial)}
        />
      </Toolbar>
    </AppBar>
  );
}

export default SubMenuBar;
