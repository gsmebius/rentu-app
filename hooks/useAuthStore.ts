import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface User {
//   id: number;
//   email: string;
//   names: string;
//   last_names: string;
// }

// interface AuthState {
//   user: User | null;
//   accessToken: string | null;
//   refreshToken: string | null;
//   sessionId: string | null;
//   login: (user: User, accessToken: string, refreshToken: string, sessionId: string) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//     // empiiza null, pero en el login se rellenan y en el logout vuelve a null
//       user: null,
//       accessToken: null,
//       refreshToken: null,
//       sessionId: null,
//       login: (user, accessToken, refreshToken, sessionId) =>
//         set({ user, accessToken, refreshToken, sessionId }),
//       logout: () => set({ user: null, accessToken: null, refreshToken: null, sessionId: null }),
//     }),
//     {
//     // Lo guardamos todo en el storage
//       name: 'auth-storage',
//       storage: createJSONStorage(() => AsyncStorage),
//     }
//   )
// );

interface User {
  id: number;
  email: string;
  names: string;
  last_names: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  sessionId: string | null;
  login: (user: User, accessToken: string, refreshToken: string, sessionId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  sessionId: null,
  login: (user, accessToken, refreshToken, sessionId) =>
    set({ user, accessToken, refreshToken, sessionId }),
  logout: () => set({
    user: null,
    accessToken: null,
    refreshToken: null,
    sessionId: null
  }),
}));