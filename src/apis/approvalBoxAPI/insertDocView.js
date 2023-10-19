import axios from 'axios';

export default function insertDocView(docId) {
  const url = `http://localhost:8080/approvbox/doc/read?docId=${docId}`;
  return axios.post(url).catch((error) => {
    console.error('Error inserting document view:', error);
  });
}
