const REGEX = {
  LETTERS_AND_SPACES_ONLY: new RegExp(/^[a-zA-Z ]+$/),
  LETTERS_ONLY: new RegExp(/^[a-zA-Z ]+$/),
  USERNAME: new RegExp(/^(?=.*[a-zA-Z_])[a-zA-Z0-9_.]+$/),
  WHITESPACE: new RegExp(/\s/g),
};

module.exports = REGEX;
