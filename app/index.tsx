import { Redirect } from "expo-router";
import { useAuth } from '../contexts/authContext';

export default function Index() {
  const { user } = useAuth();
  return <Redirect href={user ? '/(tabs)' : '/login'} />;
}
