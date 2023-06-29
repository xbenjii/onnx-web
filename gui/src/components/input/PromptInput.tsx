import { doesExist, Maybe } from '@apextoaster/js-utils';
import { TextField } from '@mui/material';
import { IconButton, InputAdornment, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, Save as SaveIcon } from '@mui/icons-material';
import { Stack } from '@mui/system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

export interface PromptValue {
  prompt: string;
  negativePrompt?: string;
}

export interface PromptInputProps extends PromptValue {
  onChange?: Maybe<(value: PromptValue) => void>;
  savePrompt?: Maybe<(value: string) => void>;
  prompts?: Array<string>;
}

export const PROMPT_GROUP = 75;

function splitPrompt(prompt: string): Array<string> {
  return prompt
    .split(',')
    .flatMap((phrase) => phrase.split(' '))
    .map((word) => word.trim())
    .filter((word) => word.length > 0);
}

export function PromptInput(props: PromptInputProps) {
  const { prompt = '', negativePrompt = '', prompts = [] } = props;

  const tokens = splitPrompt(prompt);
  const groups = Math.ceil(tokens.length / PROMPT_GROUP);

  const { t } = useTranslation();
  const helper = t('input.prompt.tokens', {
    groups,
    tokens: tokens.length,
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return <Stack spacing={2}>
    <TextField
      label={t('parameter.prompt')}
      helperText={helper}
      variant='outlined'
      value={prompt}
      onChange={(event) => {
        if (doesExist(props.onChange)) {
          props.onChange({
            prompt: event.target.value,
            negativePrompt,
          });
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton edge="start" color="primary" aria-label="load prompt" onClick={handleClick}>
              <MenuIcon />
            </IconButton>
            <Menu
              id="prompt-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {prompts.map((savedPrompt: string, idx: number) => (
                <MenuItem key={idx} onClick={() => {
                  if (doesExist(props.onChange)) {
                    props.onChange({
                      prompt: savedPrompt
                    });
                  }
                  handleClose();
                }}>
                  {savedPrompt}
                </MenuItem>
              ))}
            </Menu>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end" aria-label="save prompt" onClick={() => {
              if(doesExist(props.savePrompt)) {
                props.savePrompt(prompt);
              }
            }}>
              <SaveIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
    <TextField
      label={t('parameter.negativePrompt')}
      variant='outlined'
      value={negativePrompt}
      onChange={(event) => {
        if (doesExist(props.onChange)) {
          props.onChange({
            prompt,
            negativePrompt: event.target.value,
          });
        }
      }}
    />
  </Stack>;
}
