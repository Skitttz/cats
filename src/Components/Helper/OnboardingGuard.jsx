import { Navigate, useLocation } from 'react-router';
import { useUser } from '../../UserContext';

const ONBOARDING_PATH = '/conta/completar-perfil';

const OnboardingGuard = ({ children }) => {
  const { data, login } = useUser();
  const { pathname } = useLocation();

  if (
    login === true &&
    data?.onboarding_required &&
    pathname !== ONBOARDING_PATH
  ) {
    return <Navigate to={ONBOARDING_PATH} replace />;
  }

  return children;
};

export default OnboardingGuard;
