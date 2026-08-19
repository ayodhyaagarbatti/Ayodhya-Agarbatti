import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, ShieldCheck, User } from 'lucide-react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { auth, googleProvider, db } from '../firebase';

const createOrUpdateAccount = async (firebaseUser) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const existing = await getDoc(userRef);
    await setDoc(userRef, {
        name: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || '',
        provider: 'google',
        lastLoginAt: serverTimestamp(),
        ...(existing.exists() ? {} : { createdAt: serverTimestamp() })
    }, { merge: true });
};

const AccountModal = ({ isOpen, onClose, user }) => {
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleSignIn = async () => {
        setError('');
        setIsSigningIn(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await createOrUpdateAccount(result.user);
            onClose();
        } catch (err) {
            console.error('Google sign-in error:', err);
            setError(err.code === 'auth/popup-closed-by-user' ? '' : 'Sign-in failed. Please try again.');
        } finally {
            setIsSigningIn(false);
        }
    };

    const handleSignOut = async () => {
        await signOut(auth);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[70] flex items-center justify-center p-6"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-ivory text-charcoal w-full max-w-sm rounded-2xl shadow-2xl border border-gold/20 p-8 relative"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-charcoal">
                        <X size={20} />
                    </button>

                    {user ? (
                        <div className="text-center">
                            <img
                                src={user.photoURL || '/images/ayodhya_logo.png'}
                                alt={user.displayName || 'Account'}
                                className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-gold/40 object-cover"
                            />
                            <h3 className="font-heading text-lg mb-1">{user.displayName || 'Welcome'}</h3>
                            <p className="text-xs text-gray-500 mb-6">{user.email}</p>
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center justify-center gap-2 bg-charcoal text-white py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-gold hover:text-charcoal transition-all"
                            >
                                <LogOut size={14} /> Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4">
                                <User size={24} />
                            </div>
                            <h3 className="font-heading text-lg mb-2">Sign in to Ayodhya Agarbatti</h3>
                            <p className="text-xs text-gray-500 mb-6">Create an account with Google to track your orders and checkout faster.</p>

                            {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

                            <button
                                onClick={handleGoogleSignIn}
                                disabled={isSigningIn}
                                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3 rounded-lg font-semibold text-sm hover:border-gold transition-all disabled:opacity-50"
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18">
                                    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.87 2.69-6.62z" />
                                    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18z" />
                                    <path fill="#FBBC05" d="M3.96 10.71A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33z" />
                                    <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z" />
                                </svg>
                                {isSigningIn ? 'Signing in...' : 'Continue with Google'}
                            </button>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <Link to="/admin" onClick={onClose} className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 hover:text-gold transition-colors">
                                    <ShieldCheck size={12} /> Admin Access
                                </Link>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AccountModal;
