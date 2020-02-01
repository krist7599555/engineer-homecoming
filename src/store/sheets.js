import axios from 'axios';
import * as _ from 'lodash';

export const config = {
  spreadsheetId: '1eEbzyLxhzDX-1W16OXK0cywdV09LahbAxTw4Q2XjA1E',
  range: 'Main!A:Z',
  apiKey: 'AIzaSyCgZiT4KNhEYChRrJj9DQnwA8FsViBf_EI',
  url: 'https://docs.google.com/spreadsheets/d/1eEbzyLxhzDX-1W16OXK0cywdV09LahbAxTw4Q2XjA1E/edit'
};

export function getNameList() {
  return axios
    .get(
      `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${config.range}`,
      { params: { key: config.apiKey } }
    )
    .then(res => {
      const [h, ...t] = res.data.values;
      return _.map(t, (r, id) => _.assign({ id: id + 1 }, _.zipObject(h, r)));
    });
}
