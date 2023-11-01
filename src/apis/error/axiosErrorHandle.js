export default function axiosErrorHandle(error) {
  const data = error?.response?.data;
  if (data?.errors) {
    data.errors.map((ele) => {
      alert(ele.message);
    });
  } else {
    alert(data?.message);
  }
}
