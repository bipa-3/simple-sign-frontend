import axios from 'axios';

export default function getDocView() {
  const url = `http://localhost:8080/approvbox/doc/getread`;
  return axios.get(url).catch((error) => {
    console.error('Error inserting document view:', error);
  });
}
