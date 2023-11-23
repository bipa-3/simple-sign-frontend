import axios from 'axios';
import base_url from '../base_url';

// axios의 defaults 설정을 사용하여 withCredentials를 활성화
axios.defaults.withCredentials = true;

export default function getDocsList(
  viewItems,
  itemsPerPage,
  searchInput,
  sortStatus,
  radioSortValue,
  lastApprovalDate,
  lastDocId
) {
  // viewItems 배열을 쉼표로 구분된 문자열로 변환
  const viewItemsString = viewItems.join(',');

  // URL 생성
  let url =
    base_url +
    `approvbox/view?viewItems=${viewItemsString}&itemsPerPage=${itemsPerPage}&searchInput=${searchInput}&sortStatus=${sortStatus}&radioSortValue=${radioSortValue}`;

  // lastApprovalDate 및 lastDocId가 null이 아닌 경우에만 URL에 추가
  if (lastApprovalDate) {
    url += `&lastApprovalDate=${lastApprovalDate}`;
  }
  if (lastDocId) {
    url += `&lastDocId=${lastDocId}`;
  }

  return axios.get(url);
}

export function getDocsListCount(viewItems, searchInput, radioSortValue) {
  // viewItems 배열을 쉼표로 구분된 문자열로 변환
  const viewItemsString = viewItems.join(',');

  const url =
    base_url +
    `approvbox/count?viewItems=${viewItemsString}&searchInput=${searchInput}&radioSortValue=${radioSortValue}`;

  return axios.get(url);
}

export function detailSearchDocs(
  viewItems,
  itemsPerPage,
  detailSearchState,
  sortStatus,
  radioSortValue,
  lastApprovalDate,
  lastDocId
) {
  const url = base_url + `approvbox/search`;
  const payload = {
    viewItems: viewItems,
    itemsPerPage: itemsPerPage,
    ...detailSearchState,
    sortStatus: sortStatus,
    radioSortValue: radioSortValue,
    lastApprovalDate: lastApprovalDate,
    lastDocId: lastDocId,
  };

  return axios.post(url, payload);
}

export function detailSearchDocsCount(
  viewItems,
  detailSearchState,
  radioSortValue
) {
  const url = base_url + `approvbox/search`;
  const payload = {
    viewItems: viewItems,
    ...detailSearchState,
    radioSortValue: radioSortValue,
  };

  return axios.post(url, payload);
}
