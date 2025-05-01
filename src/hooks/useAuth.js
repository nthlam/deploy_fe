import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Custom hook để sử dụng AuthContext
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth; 