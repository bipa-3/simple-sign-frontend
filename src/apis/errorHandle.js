export default function errorHandle(res) {
  return res.json().then((data) => {
    if (data.errors) {
      data.errors.map((ele) => {
        alert(ele.message);
      });
    } else {
      alert(data.message);
    }
  });
}
