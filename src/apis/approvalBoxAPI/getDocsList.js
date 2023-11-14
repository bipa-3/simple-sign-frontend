import axios from 'axios';
import base_url from '../base_url';

// axios의 defaults 설정을 사용하여 withCredentials를 활성화
axios.defaults.withCredentials = true;

export default function getDocsList(
  viewItems,
  itemsPerPage,
  offset,
  searchInput,
  sortStatus,
  radioSortValue
) {
  // viewItems 배열을 쉼표로 구분된 문자열로 변환
  const viewItemsString = viewItems.join(',');

  const url =
    base_url +
    `approvbox/view?viewItems=${viewItemsString}&itemsPerPage=${itemsPerPage}&offset=${offset}&searchInput=${searchInput}&sortStatus=${sortStatus}&radioSortValue=${radioSortValue}`;

  return axios.get(url);
}

export function detailSearchDocs(
  viewItems,
  itemsPerPage,
  offset,
  detailSearchState,
  sortStatus,
  radioSortValue
) {
  const url = base_url + `approvbox/search`;
  const payload = {
    viewItems: viewItems,
    itemsPerPage: itemsPerPage,
    offset: offset,
    ...detailSearchState,
    sortStatus: sortStatus,
    radioSortValue: radioSortValue,
  };

  return axios.post(url, payload);
}
