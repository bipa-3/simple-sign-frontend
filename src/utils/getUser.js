const getAuthrity = () => {
  return localStorage.getItem('authority');
};

const getCompId = () => {
  return localStorage.getItem('compId');
};

const getOrgUserId = () => {
  return localStorage.getItem('orgUserId');
};

export { getAuthrity, getCompId, getOrgUserId };
