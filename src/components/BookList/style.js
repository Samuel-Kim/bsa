import { makeStyles } from '@material-ui/core/styles';

export const useBookStyles = makeStyles(() => ({
  root: {
    margin: '0 auto',
    display: 'block',
  },
}));

export const useStyles = makeStyles((theme) => ({
  bookGrid: {
    columnGap: '25px',
    [theme.breakpoints.down('xs')]: {
      columnCount: 1,
    },
    [theme.breakpoints.only('sm')]: {
      columnCount: 2,
    },
    [theme.breakpoints.only('md')]: {
      columnCount: 3,
    },
    [theme.breakpoints.only('lg')]: {
      columnCount: 4,
    },
    [theme.breakpoints.up('xl')]: {
      columnCount: 5,
    },
  },
}));
