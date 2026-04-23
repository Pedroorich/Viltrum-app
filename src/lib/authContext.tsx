import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

interface AuthContextType {
  user: User | null;
  viltrumRank: string;
  xp: number;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, viltrumRank: 'Recruta', xp: 0, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [viltrumRank, setViltrumRank] = useState('Recruta');
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch or create user doc
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          setViltrumRank(data.rank || 'Recruta');
          setXp(data.xp || 0);
        } else {
          // Create new Viltrumita profile
          try {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email || 'guest',
              rank: 'Recruta',
              xp: 0,
              createdAt: serverTimestamp()
            });
            setViltrumRank('Recruta');
            setXp(0);
          } catch(e) {
             console.error("Failed to forge Viltrum profile: ", e);
          }
        }
        setLoading(false);
      } else {
        setUser(null);
        setViltrumRank('Recruta');
        setXp(0);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, viltrumRank, xp, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
