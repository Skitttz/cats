import { useLocation } from 'react-router';

export function CurrentPathProfileUser() {
  const location = useLocation();
  const currentPathname = location.pathname;
  if (
    currentPathname.startsWith('/perfil') ||
    currentPathname.startsWith('/conta')
  )
    return true;

  return false;
}
