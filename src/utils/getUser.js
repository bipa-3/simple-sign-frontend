const getAuthrity = () => {
  return localStorage.getItem('authority');
};

const getCompId = () => {
  return localStorage.getItem('compId');
};

const getCompName = () => {
  return localStorage.getItem('compName');
};

const getDeptId = () => {
  return localStorage.getItem('deptId');
};

const getDeptName = () => {
  return localStorage.getItem('deptName');
};

const getOrgUserId = () => {
  return localStorage.getItem('orgUserId');
};

const getUserId = () => {
  return localStorage.getItem('userId');
};

const getUserName = () => {
  return localStorage.getItem('userName');
};

export {
  getAuthrity,
  getCompId,
  getCompName,
  getDeptId,
  getDeptName,
  getOrgUserId,
  getUserId,
  getUserName,
};
