export default {
  LETTERS_AND_SPACES_ONLY: new RegExp(/^[a-zA-Z ]+$/),
  LETTERS_ONLY: new RegExp(/^[a-zA-Z]+$/),
  PASSWORD: new RegExp(/^(?=.*\d)(?=.*[a-zA-Z]).+$/),
  USERNAME: new RegExp(/^(?=.*[a-zA-Z])[a-zA-Z0-9_.]+$/),
};
