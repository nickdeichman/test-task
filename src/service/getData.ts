import axios from 'axios';

const BASE_URL = 'https://652f91320b8d8ddac0b2b62b.mockapi.io';

export const autocompleteData = {
  get: () => axios(`${BASE_URL}/autocomplete`).then(({ data }) => data),
};

