export const CONFIG_APP = {
  NAME: process.env.REACT_APP_NAME_APP || '',
  VERSION: process.env.REACT_APP_VERSION_APP || '1.0.0',
  DESCRIPTION: process.env.REACT_APP_DESCRIPTION_APP || '',
}

export const CONFIG_SECUR = {
  ALLOWED: process.env.REACT_APP_AUTH_MS_DOMAIN,
  LIMIT: process.env.RAMIT_LIMIT || 60 * 60,
  ACCESS_KEY: process.env.REACT_APP_ACCESS_KEY,
  BEARER_KEY: process.env.REACT_APP_BEARER_KEY,
}

export const CONFIG_HEADER_AUTH = {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: process.env.REACT_APP_BEARER_KEY + ' ' + localStorage.getItem('Token'),
  },
}

export const CONFIG_HEADER_NO_AUTH = {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
}
