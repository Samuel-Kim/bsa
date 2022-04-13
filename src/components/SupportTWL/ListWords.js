import React, { useEffect, useMemo, useState } from 'react';
import ListAltRoundedIcon from '@material-ui/icons/ListAltRounded';
import { Box, Popover } from '@material-ui/core';

function ListWords({ items, itemIndex, tsvs }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [listWords, setListWords] = useState();
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const list = {};
    if (tsvs) {
      Object.entries(tsvs).forEach(([key, chapters]) => {
        Object.entries(chapters).forEach(([key, verses]) => {
          verses.forEach((verse) => {
            if (Object.keys(list).includes(verse.TWLink)) {
              if (list[verse.TWLink].includes(verse.Reference)) {
                return;
              } else {
                list[verse.TWLink] = [...list[verse.TWLink], verse.Reference];
              }
            } else {
              list[verse.TWLink] = [verse.Reference];
            }
          });
        });
      });
    }
    setListWords(list);
    console.log(list);
  }, [tsvs]);
  const listIcon = useMemo(
    () =>
      items &&
      items[itemIndex] &&
      listWords &&
      listWords[items[itemIndex].TWLink] &&
      listWords[items[itemIndex].TWLink].length > 1 && (
        <ListAltRoundedIcon
          onClick={(event) => setAnchorEl(event.currentTarget)}
          color="primary"
        />
      ),
    [itemIndex, items, listWords]
  );
  const listReference = useMemo(
    () =>
      items &&
      listWords[items[itemIndex].TWLink].map((el) => {
        return (
          <p style={{ paddingLeft: '15px', paddingRight: '15px' }} key={el}>
            {el}
          </p>
        );
      }),
    [itemIndex, items, listWords]
  );

  return (
    <>
      <Box display={'flex'} justifyContent={'center'}>
        {listIcon}
      </Box>
      <Popover anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>
        {listReference}
      </Popover>
    </>
  );
}

export default ListWords;
