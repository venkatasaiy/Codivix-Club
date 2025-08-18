// App.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';

// Import Firebase modules with proper error handling
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile
} from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZrglM9-lsraWWfiNam5znMGlwbGp1SiI",
  authDomain: "codivixclub.firebaseapp.com",
  projectId: "codivixclub",
  storageBucket: "codivixclub.firebasestorage.app",
  messagingSenderId: "850201515528",
  appId: "1:850201515528:web:b8fd428bd4dff976c963bd",
  measurementId: "G-7RC1PVBBW2"
};

// Initialize Firebase with proper error handling
let app;
let auth;
let db;

try {
  // Check if Firebase is already initialized
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Contexts
const AuthContext = createContext();
const DataContext = createContext();
const ThemeContext = createContext();

// Data Provider
const DataProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Set up real-time listeners with proper error handling
  useEffect(() => {
    let unsubscribeEvents, unsubscribeRegistrations, unsubscribeAnnouncements, 
        unsubscribeCoordinators, unsubscribeCertificates, unsubscribeActivityLogs;

    try {
      // Validate Firebase initialization
      if (!db) {
        console.error('Firebase Firestore not initialized');
        setLoading(false);
        return;
      }

      // Set up all listeners
      unsubscribeEvents = onSnapshot(
        collection(db, 'events'),
        (snapshot) => {
          try {
            const eventData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setEvents(eventData);
          } catch (error) {
            console.error('Error processing events:', error);
          }
        },
        (error) => {
          console.error('Error listening to events:', error);
        }
      );

      unsubscribeRegistrations = onSnapshot(
        collection(db, 'registrations'),
        (snapshot) => {
          try {
            const registrationData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setRegistrations(registrationData);
          } catch (error) {
            console.error('Error processing registrations:', error);
          }
        },
        (error) => {
          console.error('Error listening to registrations:', error);
        }
      );

      unsubscribeAnnouncements = onSnapshot(
        collection(db, 'announcements'),
        (snapshot) => {
          try {
            const announcementData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setAnnouncements(announcementData);
          } catch (error) {
            console.error('Error processing announcements:', error);
          }
        },
        (error) => {
          console.error('Error listening to announcements:', error);
        }
      );

      unsubscribeCoordinators = onSnapshot(
        collection(db, 'coordinators'),
        (snapshot) => {
          try {
            const coordinatorData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setCoordinators(coordinatorData);
          } catch (error) {
            console.error('Error processing coordinators:', error);
          }
        },
        (error) => {
          console.error('Error listening to coordinators:', error);
        }
      );

      unsubscribeCertificates = onSnapshot(
        collection(db, 'certificates'),
        (snapshot) => {
          try {
            const certificateData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setCertificates(certificateData);
          } catch (error) {
            console.error('Error processing certificates:', error);
          }
        },
        (error) => {
          console.error('Error listening to certificates:', error);
        }
      );

      unsubscribeActivityLogs = onSnapshot(
        query(collection(db, 'activityLogs'), orderBy('timestamp', 'desc')),
        (snapshot) => {
          try {
            const logData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setActivityLogs(logData);
          } catch (error) {
            console.error('Error processing activity logs:', error);
          }
        },
        (error) => {
          console.error('Error listening to activity logs:', error);
        }
      );

      // Initialize with sample data if empty
      const initializeData = async () => {
        try {
          // Validate Firestore
          if (!db) {
            console.error('Firestore not available');
            setLoading(false);
            return;
          }

          const eventsSnapshot = await getDocs(collection(db, 'events'));
          if (eventsSnapshot.empty) {
            const initialEvents = [
              {
                title: "Hackathon",
                description: "A 24-hour coding marathon to build innovative solutions using AI and ML.",
                date: "2024-07-15",
                time: "10:00 AM",
                venue: "Main Auditorium",
                category: "Coding",
                image: "https://placehold.co/400x250/3b82f6/ffffff?text=Hackathon",
                teamSize: "1-4",
                price: 150,
                maxParticipants: 100,
                registeredCount: 42,
                googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfexample1/viewform"
              },
              {
                title: "AI Workshop",
                description: "Hands-on session on building neural networks and deep learning models.",
                date: "2024-07-18",
                time: "2:00 PM",
                venue: "AI Lab, Block C",
                category: "Workshop",
                image: "https://placehold.co/400x250/10b981/ffffff?text=AI+Workshop",
                teamSize: "1",
                price: 200,
                maxParticipants: 50,
                registeredCount: 28,
                googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfexample2/viewform"
              },
              {
                title: "Tech Quiz",
                description: "Test your knowledge in computer science, algorithms, and tech history.",
                date: "2024-07-20",
                time: "11:00 AM",
                venue: "Seminar Hall",
                category: "Competition",
                image: "https://placehold.co/400x250/f59e0b/ffffff?text=Tech+Quiz",
                teamSize: "1-2",
                price: 100,
                maxParticipants: 80,
                registeredCount: 67,
                googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfexample3/viewform"
              }
            ];
            
            for (const event of initialEvents) {
              await addDoc(collection(db, 'events'), event);
            }
          }

          const coordinatorsSnapshot = await getDocs(collection(db, 'coordinators'));
          if (coordinatorsSnapshot.empty) {
            const initialCoordinators = [
              {
                name: "Dr. Anjali Sharma",
                department: "AI & ML",
                role: "Event Head",
                phone: "+91 9876543210",
                email: "anjali.sharma@college.edu",
                photo: "https://placehold.co/150x150/d946ef/ffffff?text=AS"
              },
              {
                name: "Rahul Verma",
                department: "Computer Science",
                role: "Technical Coordinator",
                phone: "+91 8765432109",
                email: "rahul.verma@college.edu",
                photo: "https://placehold.co/150x150/06b6d4/ffffff?text=RV"
              }
            ];
            
            for (const coordinator of initialCoordinators) {
              await addDoc(collection(db, 'coordinators'), coordinator);
            }
          }

          const announcementsSnapshot = await getDocs(collection(db, 'announcements'));
          if (announcementsSnapshot.empty) {
            await addDoc(collection(db, 'announcements'), {
              message: "Venue for AI Workshop changed to AI Lab, Block C.",
              urgent: false,
              date: "2024-06-08"
            });
          }

          setLoading(false);
        } catch (error) {
          console.error('Error initializing ', error);
          setLoading(false);
        }
      };

      initializeData();
    } catch (error) {
      console.error('Error setting up listeners:', error);
      setLoading(false);
    }

    // Cleanup function
    return () => {
      if (unsubscribeEvents) unsubscribeEvents();
      if (unsubscribeRegistrations) unsubscribeRegistrations();
      if (unsubscribeAnnouncements) unsubscribeAnnouncements();
      if (unsubscribeCoordinators) unsubscribeCoordinators();
      if (unsubscribeCertificates) unsubscribeCertificates();
      if (unsubscribeActivityLogs) unsubscribeActivityLogs();
    };
  }, []);

  // CRUD operations with proper error handling
  const addEvent = async (eventData) => {
    try {
      // Validate Firestore
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const docRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        registeredCount: 0
      });
      
      // Add activity log
      await addDoc(collection(db, 'activityLogs'), {
        action: 'event_added',
        userId: eventData.createdBy || 'system',
        details: {
          eventId: docRef.id,
          eventName: eventData.title
        },
        timestamp: new Date().toISOString()
      });
      
      return { id: docRef.id, ...eventData, registeredCount: 0 };
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  const updateEvent = async (eventId, eventData) => {
    try {
      // Validate Firestore
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, eventData);
      
      // Add activity log
      await addDoc(collection(db, 'activityLogs'), {
        action: 'event_updated',
        userId: eventData.updatedBy || 'system',
        details: {
          eventId: eventId,
          eventName: eventData.title
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      // Validate Firestore
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      // Get event details before deletion
      const eventQuery = query(collection(db, 'events'), where('id', '==', eventId));
      const eventSnapshot = await getDocs(eventQuery);
      const eventData = eventSnapshot.docs[0]?.data();
      
      // Delete the event
      await deleteDoc(doc(db, 'events', eventId));
      
      // Add activity log
      await addDoc(collection(db, 'activityLogs'), {
        action: 'event_deleted',
        userId: 'system',
        details: {
          eventId: eventId,
          eventName: eventData?.title || 'Unknown Event'
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  const addAnnouncement = async (announcementData) => {
    try {
      // Validate Firestore
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const docRef = await addDoc(collection(db, 'announcements'), {
        ...announcementData,
        date: new Date().toISOString().split('T')[0]
      });
      
      // Add activity log
      await addDoc(collection(db, 'activityLogs'), {
        action: 'announcement_added',
        userId: 'system',
        details: {
          announcementId: docRef.id,
          message: announcementData.message
        },
        timestamp: new Date().toISOString()
      });
      
      return { id: docRef.id, ...announcementData, date: new Date().toISOString().split('T')[0] };
    } catch (error) {
      console.error('Error adding announcement:', error);
      throw error;
    }
  };

  const updateAnnouncement = async (announcementId, announcementData) => {
    try {
      // Validate Firestore
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const announcementRef = doc(db, 'announcements', announcementId);
      await updateDoc(announcementRef, announcementData);
      
      // Add activity log
      await addDoc(collection(db, 'activityLogs'), {
        action: 'announcement_updated',
        userId: 'system',
        details: {
          announcementId: announcementId,
          message: announcementData.message
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  };

  const deleteAnnouncement = async (announcementId) => {
    try {
      // Validate Firestore
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      // Get announcement details before deletion
      const announcementQuery = query(collection(db, 'announcements'), where('id', '==', announcementId));
      const announcementSnapshot = await getDocs(announcementQuery);
      const announcementData = announcementSnapshot.docs[0]?.data();
      
      // Delete the announcement
      await deleteDoc(doc(db, 'announcements', announcementId));
      
      // Add activity log
      await addDoc(collection(db, 'activityLogs'), {
        action: 'announcement_deleted',
        userId: 'system',
        details: {
          announcementId: announcementId,
          message: announcementData?.message || 'Unknown Announcement'
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  };

  const addCoordinator = async (coordinatorData) => {
    try {
      // Validate Firestore
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const docRef = await addDoc(collection(db, 'coordinators'), coordinatorData);
      
      // Add activity log
      await addDoc(collection(db, 'activityLogs'), {
        action: 'coordinator_added',
        userId: 'system',
        details: {
          coordinatorId: docRef.id,
          name: coordinatorData.name
        },
        timestamp: new Date().toISOString()
      });
      
      return { id: docRef.id, ...coordinatorData };
    } catch (error) {
      console.error('Error adding coordinator:', error);
      throw error;
    }
  };

  const updateCoordinator = async (coordinatorId, coordinatorData) => {
    try {
      // Validate Firestore
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const coordinatorRef = doc(db, 'coordinators', coordinatorId);
      await updateDoc(coordinatorRef, coordinatorData);
      
      // Add activity log
      await addDoc(collection(db, 'activityLogs'), {
        action: 'coordinator_updated',
        userId: 'system',
        details: {
          coordinatorId: coordinatorId,
          name: coordinatorData.name
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating coordinator:', error);
      throw error;
    }
  };

  const deleteCoordinator = async (coordinatorId) => {
    try {
      // Validate Firestore
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      // Get coordinator details before deletion
      const coordinatorQuery = query(collection(db, 'coordinators'), where('id', '==', coordinatorId));
      const coordinatorSnapshot = await getDocs(coordinatorQuery);
      const coordinatorData = coordinatorSnapshot.docs[0]?.data();
      
      // Delete the coordinator
      await deleteDoc(doc(db, 'coordinators', coordinatorId));
      
      // Add activity log
      await addDoc(collection(db, 'activityLogs'), {
        action: 'coordinator_deleted',
        userId: 'system',
        details: {
          coordinatorId: coordinatorId,
          name: coordinatorData?.name || 'Unknown Coordinator'
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error deleting coordinator:', error);
      throw error;
    }
  };

  const issueCertificate = async (certificateData) => {
    try {
      // Validate Firestore
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const docRef = await addDoc(collection(db, 'certificates'), {
        ...certificateData,
        issuedAt: new Date().toISOString(),
        status: 'issued'
      });
      
      // Add activity log
      await addDoc(collection(db, 'activityLogs'), {
        action: 'certificate_issued',
        userId: certificateData.userId,
        details: {
          certificateId: docRef.id,
          eventName: certificateData.eventName
        },
        timestamp: new Date().toISOString()
      });
      
      return { id: docRef.id, ...certificateData, issuedAt: new Date().toISOString(), status: 'issued' };
    } catch (error) {
      console.error('Error issuing certificate:', error);
      throw error;
    }
  };

  const registerForEvent = async (userId, eventId, registrationData) => {
    // Check if already registered
    const existingRegistration = registrations.find(
      reg => reg.userId === userId && reg.eventId === eventId
    );
    
    if (existingRegistration) {
      throw new Error('You are already registered for this event');
    }

    // Check if event has available slots
    const event = events.find(e => e.id === eventId);
    if (event && event.registeredCount >= event.maxParticipants) {
      throw new Error('This event is full');
    }

    try {
      // Validate Firestore
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const newRegistration = {
        userId,
        eventId,
        ...registrationData,
        registeredAt: new Date().toISOString(),
        status: 'pending',
        paymentStatus: 'unpaid'
      };

      const docRef = await addDoc(collection(db, 'registrations'), newRegistration);
      
      // Update event registration count
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        registeredCount: event.registeredCount + 1
      });

      // Add activity log
      await addDoc(collection(db, 'activityLogs'), {
        action: 'event_registration',
        userId: userId,
        details: {
          eventId: eventId,
          eventName: event.title,
          registrationId: docRef.id
        },
        timestamp: new Date().toISOString()
      });

      return { id: docRef.id, ...newRegistration };
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  };

  const updateProfile = async (userId, profileData) => {
    try {
      // In a real app, you would update the user document in Firestore
      // For now, we'll just simulate the update
      console.log('Updating profile for user:', userId, profileData);
      
      // Add activity log
      if (db) {
        await addDoc(collection(db, 'activityLogs'), {
          action: 'profile_updated',
          userId: userId,
          details: {
            name: profileData.name,
            email: profileData.email
          },
          timestamp: new Date().toISOString()
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const getUserRegistrations = (userId) => {
    return registrations.filter(reg => reg.userId === userId);
  };

  const getEventRegistrations = (eventId) => {
    return registrations.filter(reg => reg.eventId === eventId);
  };

  const getAllData = () => ({
    events,
    registrations,
    announcements,
    coordinators,
    certificates,
    activityLogs
  });

  const value = {
    events,
    registrations,
    announcements,
    coordinators,
    certificates,
    activityLogs,
    registerForEvent,
    getUserRegistrations,
    getEventRegistrations,
    getAllData,
    addEvent,
    updateEvent,
    deleteEvent,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addCoordinator,
    updateCoordinator,
    deleteCoordinator,
    issueCertificate,
    updateProfile,
    loading
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate Firebase initialization
    if (!auth) {
      console.error('Firebase Auth not initialized');
      setLoading(false);
      return;
    }

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user claims to check admin status
          const idTokenResult = await firebaseUser.getIdTokenResult();
          const isAdmin = idTokenResult.claims.admin || false;
          
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            role: isAdmin ? 'admin' : 'student'
          };
          
          setUser(userData);
        } catch (error) {
          console.error('Error getting user claims:', error);
          // Even if claims fail, we can still set up the user
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.email.split('@')[0],
            role: 'student'
          };
          setUser(userData);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login function with improved error handling
  const login = async (email, password, secretCode = null) => {
    try {
      // Validate Firebase Auth
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      console.log('Attempting login with:', email);
      
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log('User signed in:', firebaseUser.uid);
      
      // Get user claims to check admin status
      const idTokenResult = await firebaseUser.getIdTokenResult();
      const isAdmin = idTokenResult.claims.admin || false;
      
      console.log('User is admin:', isAdmin);
      
      // For admin users, verify the secret code
      if (isAdmin && secretCode !== 'CODIVIX2025') {
        throw new Error('Invalid admin credentials');
      }
      
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        role: isAdmin ? 'admin' : 'student'
      };
      
      setUser(userData);
      console.log('Login successful:', userData);
      
      return userData;
    } catch (error) {
      console.error('Login error details:', error);
      
      let errorMessage = 'Login failed';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email address';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many login attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Authentication method not enabled. Please contact the administrator.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password';
          break;
        default:
          errorMessage = error.message || 'Login failed';
      }
      
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Validate Firebase Auth
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      // Validate Firebase Auth
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      if (!email) {
        throw new Error('Email address is required');
      }
      
      await sendPasswordResetEmail(auth, email);
      return 'Password reset email sent successfully. Please check your inbox.';
    } catch (error) {
      console.error('Password reset error:', error);
      
      let errorMessage = 'Failed to send password reset email';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email address';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage = error.message || 'Failed to send password reset email';
      }
      
      throw new Error(errorMessage);
    }
  };

  // Register function (added)
  const register = async ({ name, email, password, role = 'student' }) => {
    try {
      // Validate Firebase Auth
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Set displayName on Firebase user
      try {
        await firebaseUpdateProfile(firebaseUser, { displayName: name });
      } catch (e) {
        console.warn('Failed to update displayName:', e);
      }

      // Create a basic user document + activity log
      if (db) {
        await addDoc(collection(db, 'users'), {
          uid: firebaseUser.uid,
          name,
          email,
          role,
          createdAt: new Date().toISOString()
        });

        await addDoc(collection(db, 'activityLogs'), {
          action: 'user_registered',
          userId: firebaseUser.uid,
          details: { name, email, role },
          timestamp: new Date().toISOString()
        });
      }

      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name,
        role
      };

      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already in use';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage = error.message || 'Registration failed';
      }
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    login,
    logout,
    resetPassword,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Theme Provider
const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('codvix_darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('codvix_darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hooks
const useAuth = () => useContext(AuthContext);
const useData = () => useContext(DataContext);
const useTheme = () => useContext(ThemeContext);

// Components
const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-800 dark:to-purple-900 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold">CODIVIX CLUB</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#home" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500 transition-colors">Home</a>
                <a href="#events" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500 transition-colors">Events</a>
                <a href="#coordinators" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500 transition-colors">Coordinators</a>
                {user && (
                  <>
                    <a href="#profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500 transition-colors">Profile</a>
                    {user.role === 'admin' && (
                      <a href="#admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500 transition-colors">Admin</a>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-blue-500 transition-colors"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            {!user ? (
              <div className="flex space-x-2">
                <button 
                  onClick={() => document.getElementById('login-modal').classList.remove('hidden')}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => document.getElementById('register-modal').classList.remove('hidden')}
                  className="bg-transparent border-2 border-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Register
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Welcome, {user.name}</span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 dark:bg-blue-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#home" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600">Home</a>
            <a href="#events" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600">Events</a>
            <a href="#coordinators" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600">Coordinators</a>
            {user && (
              <>
                <a href="#profile" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600">Profile</a>
                {user.role === 'admin' && (
                  <a href="#admin" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600">Admin Dashboard</a>
                )}
              </>
            )}
            <div className="flex items-center justify-between px-3 py-2">
              <button
                onClick={toggleDarkMode}
                className="flex items-center text-sm"
              >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              {!user ? (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => document.getElementById('login-modal').classList.remove('hidden')}
                    className="bg-white text-blue-600 px-3 py-1 rounded text-sm"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => document.getElementById('register-modal').classList.remove('hidden')}
                    className="bg-transparent border border-white text-white px-3 py-1 rounded text-sm"
                  >
                    Register
                  </button>
                </div>
              ) : (
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const HeroSection = () => {
  return (
    <section id="home" className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              CODIVIX <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">CLUB</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              The premier tech event of the year, organized by the AI & ML Department. 
              Join us for an unforgettable experience filled with innovation, competition, and learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => document.getElementById('register-modal').classList.remove('hidden')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Register Now
              </button>
              <button 
                onClick={() => {
                  const eventsSection = document.getElementById('events');
                  if (eventsSection) {
                    eventsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View Events
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg transform rotate-6 opacity-20"></div>
            <img 
              src="https://placehold.co/600x400/6366f1/ffffff?text=CODIVIX+Club" 
              alt="CODIVIX Club" 
              className="relative rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const CertificateSection = () => {
  const { user } = useAuth();
  const { certificates } = useData();
  const [userCertificates, setUserCertificates] = useState([]);

  useEffect(() => {
    if (user && certificates) {
      const userCerts = certificates.filter(cert => cert.userId === user.uid);
      setUserCertificates(userCerts);
    }
  }, [user, certificates]);

  if (!user || userCertificates.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Your Certificates</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Download your earned certificates</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userCertificates.map(cert => (
            <div key={cert.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{cert.eventName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Issued on {new Date(cert.issuedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    cert.status === 'issued' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  }`}>
                    {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EventCard = ({ event, onRegister }) => {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { getUserRegistrations } = useData();

  useEffect(() => {
    if (user && event) {
      const userRegs = getUserRegistrations(user.uid);
      const isReg = userRegs.some(reg => reg.eventId === event.id);
      setIsRegistered(isReg);
    }
  }, [user, event, getUserRegistrations]);

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold">
          {event.category}
        </div>
        {isRegistered && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Registered
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{event.description}</p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {new Date(event.date).toLocaleDateString()} at {event.time}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {event.venue}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Team size: {event.teamSize}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Registered: {event.registeredCount}/{event.maxParticipants}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {event.price === 0 ? 'Free' : `₹${event.price}`}
            </span>
            {event.price > 0 && <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">per team</span>}
          </div>
          <button
            onClick={() => onRegister(event)}
            disabled={!user || isRegistered}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              user && !isRegistered
                ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105' 
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {user ? (isRegistered ? 'Registered' : 'Register') : 'Login to Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

const EventsSection = () => {
  const { events } = useData();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const filteredEvents = React.useMemo(() => {
    let result = [...events];
    
    if (filter !== 'all') {
      result = result.filter(event => event.category.toLowerCase() === filter.toLowerCase());
    }
    
    if (search) {
      const searchTerm = search.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm)
      );
    }
    
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'name':
          return a.title.localeCompare(b.title);
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });
    
    return result;
  }, [events, filter, search, sortBy]);

  const handleRegister = (event) => {
    if (event.googleFormUrl) {
      window.open(event.googleFormUrl, '_blank');
    }
  };

  return (
    <section id="events" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Events</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Choose from our exciting lineup of tech events</p>
        </div>

        <div className="mb-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Events</label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="Coding">Coding</option>
                <option value="Workshop">Workshop</option>
                <option value="Competition">Competition</option>
                <option value="Exhibition">Exhibition</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="date">Date (Soonest First)</option>
                <option value="name">Name (A-Z)</option>
                <option value="price">Price (Low to High)</option>
              </select>
            </div>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No events found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} onRegister={handleRegister} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const CoordinatorCard = ({ coordinator }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-6 text-center">
        <img 
          src={coordinator.photo} 
          alt={coordinator.name}
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100 dark:border-blue-900"
        />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{coordinator.name}</h3>
        <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{coordinator.role}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{coordinator.department}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm1 2v12h14V5H3zm2 2a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 3a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H6a1 1 0 01-1-1z" />
            </svg>
            {coordinator.phone}
          </div>
          <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            {coordinator.email}
          </div>
        </div>
      </div>
    </div>
  );
};

const CoordinatorsSection = () => {
  const { coordinators } = useData();

  return (
    <section id="coordinators" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Event Coordinators</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Meet the team behind CODIVIX CLUB</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coordinators.map((coordinator) => (
            <CoordinatorCard key={coordinator.id} coordinator={coordinator} />
          ))}
        </div>
      </div>
    </section>
  );
};

const LoginForm = () => {
  const { login, resetPassword } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', secretCode: '' });
  const [error, setError] = useState('');
  const [isStudentLogin, setIsStudentLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretCode, setShowSecretCode] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      console.log('Login attempt:', { email: formData.email, isStudent: isStudentLogin });
      
      if (isStudentLogin) {
        await login(formData.email, formData.password);
      } else {
        await login(formData.email, formData.password, formData.secretCode);
      }
      document.getElementById('login-modal').classList.add('hidden');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');
    
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      const result = await resetPassword(formData.email);
      setResetSuccess(result);
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send password reset email. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full">
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`flex-1 py-2 text-center font-medium ${
            isStudentLogin 
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setIsStudentLogin(true)}
        >
          Student Login
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium ${
            !isStudentLogin 
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setIsStudentLogin(false)}
        >
          Admin Login
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        {isStudentLogin ? 'Student Login' : 'Admin Login'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {resetSuccess && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg text-sm">
          {resetSuccess}
        </div>
      )}
      
      {!forgotPassword ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isStudentLogin ? 'Email' : 'Admin Email'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder={isStudentLogin ? "Enter your email" : "admin@college.edu"}
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isStudentLogin ? 'Password' : 'Password'}
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  {showPassword ? (
                    <svg className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.00 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </div>
              </button>
            </div>
            {!isStudentLogin && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secret Code *
                </label>
                <input
                  type={showSecretCode ? 'text' : 'password'}
                  name="secretCode"
                  value={formData.secretCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-10"
                  placeholder="Enter admin secret code"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSecretCode(!showSecretCode)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {showSecretCode ? (
                      <svg className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.00 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {isStudentLogin ? 'Login as Student' : 'Login as Admin'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleForgotPassword}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter your email to reset password
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Send Reset Email
            </button>
          </div>
        </form>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isStudentLogin ? (
            <>
              <button
                onClick={() => {
                  setForgotPassword(!forgotPassword);
                  setError('');
                  setResetSuccess('');
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium mr-4"
              >
                {forgotPassword ? 'Back to Login' : 'Forgot Password?'}
              </button>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  document.getElementById('login-modal').classList.add('hidden');
                  document.getElementById('register-modal').classList.remove('hidden');
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Register now
              </button>
            </>
          ) : (
            'Contact system administrator for access'
          )}
        </p>
      </div>
    </div>
  );
};

const RegisterForm = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      await register({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password,
        role: 'student'
      });
      setSuccess('Registration successful! You are now logged in.');
      
      // Close modal after success
      setTimeout(() => {
        document.getElementById('register-modal').classList.add('hidden');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Register for CODIVIX CLUB</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg text-sm">
          {success}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-10"
                placeholder="Create a password"
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  {showPassword ? (
                    <svg className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.00 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </div>
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum 6 characters</p>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password *</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-10"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  {showConfirmPassword ? (
                    <svg className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.00 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </div>
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Register
            </button>
          </div>
        </form>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            onClick={() => {
              document.getElementById('register-modal').classList.add('hidden');
              document.getElementById('login-modal').classList.remove('hidden');
            }}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

const ProfileSection = () => {
  const { user, logout } = useAuth();
  const { updateProfile } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '', password: '' });
    }
  }, [user]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      await updateProfile(user.uid, formData);
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => {
        setIsEditing(false);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <section id="profile" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
            <button
              onClick={handleLogout}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
            >
              Logout
            </button>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg">
              {success}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="text-center">
                <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl font-bold text-blue-600 dark:text-blue-300">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 capitalize">{user.role} Account</p>
              </div>
            </div>

            <div className="lg:col-span-2">
              {!isEditing ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Edit Profile
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Full Name</span>
                      <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Email</span>
                      <span className="font-medium text-gray-900 dark:text-white">{user.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Account Type</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">{user.role}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Profile</h3>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setError('');
                        setSuccess('');
                      }}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Leave blank to keep current password"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      Update Profile
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const { 
    events, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    addAnnouncement, 
    updateAnnouncement,
    deleteAnnouncement,
    coordinators, 
    addCoordinator, 
    updateCoordinator, 
    deleteCoordinator,
    issueCertificate,
    activityLogs
  } = useData();
  
  const [activeTab, setActiveTab] = useState('events');
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingCoordinator, setEditingCoordinator] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showCoordinatorForm, setShowCoordinatorForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ message: '', urgent: false });
  const [certificateForm, setCertificateForm] = useState({ userId: '', eventName: '', eventDate: '' });
  
  if (!user || user.role !== 'admin') return null;

  const AdminTabButton = ({ id, label, activeTab, setActiveTab }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  const EventForm = ({ event, onSave, onCancel }) => {
    const [formData, setFormData] = useState(event || {
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      category: 'Coding',
      teamSize: '1',
      price: 0,
      maxParticipants: 50,
      googleFormUrl: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (event) {
          await updateEvent(event.id, formData);
        } else {
          await addEvent(formData);
        }
        setShowEventForm(false);
        setEditingEvent(null);
      } catch (error) {
        console.error('Error saving event:', error);
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {event ? 'Edit Event' : 'Add New Event'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Venue *</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="Coding">Coding</option>
                <option value="Workshop">Workshop</option>
                <option value="Competition">Competition</option>
                <option value="Exhibition">Exhibition</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Size *</label>
              <input
                type="text"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="1, 1-2, 1-4, etc."
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Registration Fee (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Participants *</label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                min="1"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Google Form URL *</label>
            <input
              type="url"
              name="googleFormUrl"
              value={formData.googleFormUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="https://forms.gle/..."
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This form will be used for event registration
            </p>
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {event ? 'Update Event' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const CoordinatorForm = ({ coordinator, onSave, onCancel }) => {
    const [formData, setFormData] = useState(coordinator || {
      name: '',
      department: '',
      role: '',
      phone: '',
      email: '',
      photo: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (coordinator) {
          await updateCoordinator(coordinator.id, formData);
        } else {
          await addCoordinator(formData);
        }
        setShowCoordinatorForm(false);
        setEditingCoordinator(null);
      } catch (error) {
        console.error('Error saving coordinator:', error);
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {coordinator ? 'Edit Coordinator' : 'Add New Coordinator'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department *</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role *</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Photo URL</label>
            <input
              type="url"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {coordinator ? 'Update Coordinator' : 'Add Coordinator'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const AnnouncementForm = ({ announcement, onSave, onCancel }) => {
    const [formData, setFormData] = useState(announcement || { message: '', urgent: false });

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (announcement) {
          await updateAnnouncement(announcement.id, formData);
        } else {
          await addAnnouncement(formData);
        }
        setShowAnnouncementForm(false);
        setEditingAnnouncement(null);
      } catch (error) {
        console.error('Error adding announcement:', error);
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {announcement ? 'Edit Announcement' : 'Add New Announcement'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter your announcement message..."
              required
            ></textarea>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="urgent"
              id="urgent"
              checked={formData.urgent}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="urgent" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Mark as urgent
            </label>
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {announcement ? 'Update Announcement' : 'Add Announcement'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const CertificateForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(certificateForm);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await issueCertificate(formData);
        setShowCertificateForm(false);
        setCertificateForm({ userId: '', eventName: '', eventDate: '' });
      } catch (error) {
        console.error('Error issuing certificate:', error);
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Issue Certificate</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">User ID *</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter user ID"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Name *</label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter event name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Date *</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Issue Certificate
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const AdminContent = () => {
    switch (activeTab) {
      case 'events':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Manage Events</h3>
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setShowEventForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Add New Event
              </button>
            </div>
            
            {showEventForm ? (
              <EventForm
                event={editingEvent}
                onSave={(eventData) => {
                  if (editingEvent) {
                    updateEvent(editingEvent.id, eventData);
                  } else {
                    addEvent(eventData);
                  }
                  setShowEventForm(false);
                  setEditingEvent(null);
                }}
                onCancel={() => {
                  setShowEventForm(false);
                  setEditingEvent(null);
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white">{event.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.date} • {event.venue}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <a href={event.googleFormUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Google Form
                      </a>
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-blue-600 dark:text-blue-400">{event.registeredCount}/{event.maxParticipants} registered</span>
                      <div className="space-x-2">
                        <button
                          onClick={() => {
                            setEditingEvent(event);
                            setShowEventForm(true);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'announcements':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Manage Announcements</h3>
              <button
                onClick={() => {
                  setEditingAnnouncement(null);
                  setShowAnnouncementForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Add Announcement
              </button>
            </div>
            
            {showAnnouncementForm ? (
              <AnnouncementForm
                announcement={editingAnnouncement}
                onSave={(announcementData) => {
                  if (editingAnnouncement) {
                    updateAnnouncement(editingAnnouncement.id, announcementData);
                  } else {
                    addAnnouncement(announcementData);
                  }
                  setShowAnnouncementForm(false);
                  setEditingAnnouncement(null);
                }}
                onCancel={() => {
                  setShowAnnouncementForm(false);
                  setEditingAnnouncement(null);
                }}
              />
            ) : null}
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Announcements</h3>
              <div className="space-y-3">
                {announcements.map(announcement => (
                  <div key={announcement.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-900 dark:text-white">{announcement.message}</p>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setEditingAnnouncement(announcement);
                            setShowAnnouncementForm(true);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteAnnouncement(announcement.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{announcement.date}</span>
                      {announcement.urgent && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                          URGENT
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'coordinators':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Manage Coordinators</h3>
              <button
                onClick={() => {
                  setEditingCoordinator(null);
                  setShowCoordinatorForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Add Coordinator
              </button>
            </div>
            
            {showCoordinatorForm ? (
              <CoordinatorForm
                coordinator={editingCoordinator}
                onSave={(coordinatorData) => {
                  if (editingCoordinator) {
                    updateCoordinator(editingCoordinator.id, coordinatorData);
                  } else {
                    addCoordinator(coordinatorData);
                  }
                  setShowCoordinatorForm(false);
                  setEditingCoordinator(null);
                }}
                onCancel={() => {
                  setShowCoordinatorForm(false);
                  setEditingCoordinator(null);
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coordinators.map(coordinator => (
                  <div key={coordinator.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center mb-3">
                      <img 
                        src={coordinator.photo} 
                        alt={coordinator.name}
                        className="w-12 h-12 rounded-full mr-3"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{coordinator.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{coordinator.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{coordinator.department}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{coordinator.phone}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{coordinator.email}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingCoordinator(coordinator);
                          setShowCoordinatorForm(true);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCoordinator(coordinator.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'registrations':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Event Registrations</h3>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                Export CSV
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <h4 className="px-6 py-4 text-lg font-semibold text-gray-900 dark:text-white">All Registrations</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Event</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {activityLogs
                      .filter(log => log.action === 'event_registration')
                      .slice(-10)
                      .map(log => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {log.details.eventName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            User #{log.userId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                            Completed
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'analytics':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {activityLogs.filter(log => log.action === 'user_registered').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Events</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{events.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Registrations</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {activityLogs.filter(log => log.action === 'event_registration').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-yellow-100 dark:bg-yellow-900 p-3">
                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Announcements</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {announcements.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h4>
              <div className="space-y-3">
                {activityLogs.slice(-5).map(log => (
                  <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{log.action.replace('_', ' ')}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                      User #{log.userId}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'certificates':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Issue Certificates</h3>
              <button
                onClick={() => setShowCertificateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Issue Certificate
              </button>
            </div>
            
            {showCertificateForm ? (
              <CertificateForm
                onSubmit={(data) => {
                  issueCertificate(data);
                  setShowCertificateForm(false);
                }}
                onCancel={() => {
                  setShowCertificateForm(false);
                }}
              />
            ) : null}
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Certificates</h3>
              <div className="space-y-3">
                {activityLogs
                  .filter(log => log.action === 'certificate_issued')
                  .slice(-5)
                  .map(log => (
                    <div key={log.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-900 dark:text-white">Certificate for {log.details.eventName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Issued to User #{log.userId}</p>
                        </div>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
                          View
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                          ISSUED
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Admin Settings</h3>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Change Admin Credentials</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Email</label>
                  <input
                    type="email"
                    value="admin@college.edu"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter new email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Confirm new password"
                  />
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                  Update Credentials
                </button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Manage Secret Code</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Secret Code</label>
                  <div className="flex">
                    <input
                      type="password"
                      value="CODIVIX2025"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      disabled
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg font-medium transition-colors">
                      Change
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  The secret code is required for admin login along with email and password.
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <section id="admin" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h2>
          
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
            <AdminTabButton id="events" label="Events" activeTab={activeTab} setActiveTab={setActiveTab} />
            <AdminTabButton id="announcements" label="Announcements" activeTab={activeTab} setActiveTab={setActiveTab} />
            <AdminTabButton id="coordinators" label="Coordinators" activeTab={activeTab} setActiveTab={setActiveTab} />
            <AdminTabButton id="registrations" label="Registrations" activeTab={activeTab} setActiveTab={setActiveTab} />
            <AdminTabButton id="analytics" label="Analytics" activeTab={activeTab} setActiveTab={setActiveTab} />
            <AdminTabButton id="certificates" label="Certificates" activeTab={activeTab} setActiveTab={setActiveTab} />
            <AdminTabButton id="settings" label="Settings" activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          <AdminContent />
        </div>
      </div>
    </section>
  );
};

const App = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setActiveTab(hash);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      
      <main>
        <HeroSection />
        <EventsSection />
        <CoordinatorsSection />
        
        {user && <ProfileSection />}
        {user && user.role === 'admin' && <AdminDashboard />}
        
        {!user && (
          <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-blue-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">Join CODIVIX CLUB</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Be part of the most exciting tech event of the year. Register now to participate in competitions, workshops, and exhibitions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => document.getElementById('login-modal').classList.remove('hidden')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => document.getElementById('register-modal').classList.remove('hidden')}
                  className="bg-transparent border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Register
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-gray-800 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">CODIVIX CLUB</h3>
              <p className="text-gray-300 mb-4">
                The premier tech event organized by the AI & ML Department. Join us for an unforgettable experience 
                filled with innovation, competition, and learning.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                <li><a href="#events" className="text-gray-300 hover:text-white transition-colors">Events</a></li>
                <li><a href="#coordinators" className="text-gray-300 hover:text-white transition-colors">Coordinators</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <p>AI & ML Department</p>
                <p>College of Engineering</p>
                <p>City, State 12345</p>
                <p>contact@codivix.edu</p>
                <p>+91 1234567890</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; CODIVIX CLUB. All rights reserved. Organized by AI & ML Department.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <div id="login-modal" className="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Login to CODIVIX CLUB</h3>
              <button
                onClick={() => document.getElementById('login-modal').classList.add('hidden')}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Register Modal */}
      <div id="register-modal" className="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Register for CODIVIX CLUB</h3>
              <button
                onClick={() => document.getElementById('register-modal').classList.add('hidden')}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

const AppWrapper = () => {
  return (
    <ThemeProvider>
      <DataProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </DataProvider>
    </ThemeProvider>
  );
};

export default AppWrapper;
