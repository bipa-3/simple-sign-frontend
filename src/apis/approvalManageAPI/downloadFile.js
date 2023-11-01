import base_url from '../base_url';
import errorHandle from '../errorHandle';

export default function downloadFile(filePath) {
  //const encodedFilePath = encodeURIComponent(filePath);
  let url = base_url + `approve/download?filePath=${filePath}`;
  return fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
}
