import {useLogoutMutation} from '@/Redux/api/auth';
import {persistor} from '@/Redux/store';

export default function useLogout() {
  const [mutateLogout, {isLoading}] = useLogoutMutation();

  const handleLogout = () => {
    persistor.purge();
    mutateLogout()
      .unwrap()
      .then(({message}) => {
        console.log(message);
      })
      .catch(err => {
        console.log(err);
      });
  };
  return {isLoadingLogout: isLoading, handleLogout};
}
