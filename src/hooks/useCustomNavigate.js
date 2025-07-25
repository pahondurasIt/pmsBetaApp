import { useNavigate } from 'react-router-dom';
const useCustomNavigate = () => {
  const navigate = useNavigate();

  return {
    goTo: (path, options = {}) => navigate(path, options),
    goLogin: () => navigate('/login'),
    goBack: () => navigate(-1),
    goMenu: () => navigate('/'),
    goAttendance: () => navigate('/attendance'),
    goPermissionSupervisor: () => navigate('/permissionsSupervisor'),
  };
};

export default useCustomNavigate;
