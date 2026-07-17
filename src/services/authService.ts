import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../context/FirebaseContext';

export type UserRole = 'USER' | 'ADMIN' | 'COMPLIANCE_OFFICER' | 'LEGAL_COUNSEL' | 'EXECUTIVE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  plan: 'free' | 'monthly' | 'annual';
  status: 'TRIAL' | 'EXPIRED' | 'SUBSCRIBED' | 'GRACE_PERIOD';
  trialStartDate: number;
  trialEndDate: number;
  projectsCreated: number;
  intent: 'HIGH' | 'MEDIUM' | 'LOW' | 'POWER';
  featureUsage: {
    aiGenerations: number;
    analyticsViews: number;
    exports: number;
  };
  createdAt?: any;
  updatedAt?: any;
}

class AuthService {
  private static instance: AuthService;
  private subscribers: ((user: User | null) => void)[] = [];
  private currentUser: User | null = null;
  private googleProvider = new GoogleAuthProvider();

  private constructor() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await this.syncUser(firebaseUser);
      } else {
        this.currentUser = null;
        this.notify();
      }
    });
  }

  private async syncUser(firebaseUser: FirebaseUser) {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    try {
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        this.currentUser = { ...userDoc.data(), id: firebaseUser.uid } as User;
      } else {
        // Create new user profile
        const now = Date.now();
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'New User',
          role: (firebaseUser.email?.includes('counsel') ? 'LEGAL_COUNSEL' : (firebaseUser.email?.includes('admin') ? 'ADMIN' : 'USER')) as UserRole,
          plan: 'free',
          status: 'TRIAL',
          trialStartDate: now,
          trialEndDate: now + (7 * 24 * 60 * 60 * 1000), // 7 days
          projectsCreated: 0,
          intent: 'MEDIUM',
          featureUsage: {
            aiGenerations: 0,
            analyticsViews: 0,
            exports: 0
          }
        };
        
        await setDoc(userDocRef, {
          ...newUser,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        this.currentUser = newUser;
      }
      this.checkTrialStatus();
      this.notify();
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
    }
  }

  private checkTrialStatus() {
    if (this.currentUser && this.currentUser.status === 'TRIAL') {
      if (Date.now() > this.currentUser.trialEndDate) {
        this.currentUser.status = 'EXPIRED';
        this.saveToFirestore();
      }
    }
  }

  private async saveToFirestore() {
    if (this.currentUser) {
      const userDocRef = doc(db, 'users', this.currentUser.id);
      try {
        await updateDoc(userDocRef, {
          ...this.currentUser,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${this.currentUser.id}`);
      }
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public subscribe(callback: (user: User | null) => void) {
    this.subscribers.push(callback);
    callback(this.currentUser);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== callback);
    };
  }

  public async signIn(email?: string, password?: string) {
    try {
      if (email && password) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithPopup(auth, this.googleProvider);
      }
    } catch (error) {
      console.error("Sign in failed", error);
      throw error;
    }
  }

  public async signUp(email: string, password: string, name: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      // syncUser will be triggered by onAuthStateChanged
    } catch (error) {
      console.error("Sign up failed", error);
      throw error;
    }
  }

  public async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign out failed", error);
    }
  }

  public async updatePlan(plan: User['plan']) {
    if (this.currentUser) {
      this.currentUser.plan = plan;
      this.currentUser.status = plan === 'free' ? 'TRIAL' : 'SUBSCRIBED';
      await this.saveToFirestore();
      this.notify();
    }
  }

  public async requestExtension() {
    if (this.currentUser && this.currentUser.status === 'EXPIRED') {
      this.currentUser.status = 'GRACE_PERIOD';
      this.currentUser.trialEndDate = Date.now() + (24 * 60 * 60 * 1000); // 24h extension
      await this.saveToFirestore();
      this.notify();
    }
  }

  public async simulateExpiration() {
    if (this.currentUser) {
      this.currentUser.status = 'EXPIRED';
      this.currentUser.trialEndDate = Date.now() - 1000;
      await this.saveToFirestore();
      this.notify();
    }
  }

  public getUser(): User | null {
    return this.currentUser;
  }

  private notify() {
    this.subscribers.forEach(callback => callback(this.currentUser));
  }
}

export const authService = AuthService.getInstance();

export function useAuth() {
  const [user, setUser] = useState<User | null>(authService.getUser());

  useEffect(() => {
    return authService.subscribe(setUser);
  }, []);

  return {
    user,
    signIn: authService.signIn.bind(authService),
    signUp: authService.signUp.bind(authService),
    signOut: authService.signOut.bind(authService),
    updatePlan: authService.updatePlan.bind(authService),
    requestExtension: authService.requestExtension.bind(authService),
    simulateExpiration: authService.simulateExpiration.bind(authService),
    isAuthenticated: !!user
  };
}
