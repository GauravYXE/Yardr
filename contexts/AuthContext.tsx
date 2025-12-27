// app/contexts/AuthContext.tsx
import { authService } from "@/services/authService";
import { garageSaleService } from "@/services/garageSaleService";
import { rateLimitService } from "@/services/rateLimitService";
import { UserProfile } from "@/types/user";
import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AuthContextType {
	session: Session | null;
	user: User | null;
	userProfile: UserProfile | null;
	loading: boolean;
	isAuthenticated: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (
		email: string,
		password: string,
		displayName?: string
	) => Promise<void>;
	signOut: () => Promise<void>;
	refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [session, setSession] = useState<Session | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const wasLoggedInRef = useRef<boolean>(false);

	useEffect(() => {
		// Get initial session on app start
		authService.getSession().then((session) => {
			setSession(session);
			setUser(session?.user || null);
			wasLoggedInRef.current = !!session?.user;

			if (session?.user) {
				loadUserProfile(session.user.id);
			}

			setLoading(false);
		});

		// Listen for auth state changes (login, logout, etc.)
		const subscription = authService.onAuthStateChange((session) => {
			const wasLoggedIn = wasLoggedInRef.current;
			const isNowLoggedIn = !!session?.user;

			setSession(session);
			setUser(session?.user || null);
			wasLoggedInRef.current = isNowLoggedIn;

			if (session?.user) {
				loadUserProfile(session.user.id);
			} else {
				setUserProfile(null);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []); // Empty dependency array - only run once on mount

	const loadUserProfile = async (userId: string) => {
		try {
			const profile = await authService.getUserProfile(userId);
			setUserProfile(profile);
		} catch (error) {
			console.error("Error loading user profile:", error);
		}
	};

	const signIn = async (email: string, password: string) => {
		try {
			const { session } = await authService.signIn(email, password);
			setSession(session);
			setUser(session.user);

			if (session.user) {
				await loadUserProfile(session.user.id);

				// Claim any anonymous sales from this device
				try {
					const deviceId = await rateLimitService.getDeviceId();
					const claimedCount = await garageSaleService.claimDeviceSales(
						deviceId
					);
					if (claimedCount > 0) {
						console.log(`Claimed ${claimedCount} device sales`);
					}
				} catch (claimError) {
					console.error("Error claiming device sales:", claimError);
					// Don't block login
				}
			}
		} catch (error) {
			console.error("Error signing in:", error);
			throw error;
		}
	};

	const signUp = async (
		email: string,
		password: string,
		displayName?: string
	) => {
		try {
			await authService.signUp(email, password, displayName);
			// Note: We don't auto-login after signup (email verification may be required)
		} catch (error) {
			console.error("Error signing up:", error);
			throw error;
		}
	};

	const signOut = async () => {
		try {
			await authService.signOut();
			setSession(null);
			setUser(null);
			setUserProfile(null);
		} catch (error) {
			console.error("Error signing out:", error);
			throw error;
		}
	};

	const refreshProfile = async () => {
		if (user) {
			await loadUserProfile(user.id);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				session,
				user,
				userProfile,
				loading,
				isAuthenticated: !!session,
				signIn,
				signUp,
				signOut,
				refreshProfile,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
