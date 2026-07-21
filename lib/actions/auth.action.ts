"use server";

import { getAdminAuth, getAdminDb } from "@/firebase/admin";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerEnv } from "@/lib/env.server";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

const updateProfileSchema = z.object({
  userId: z.string().min(1),
  name: z.string().trim().min(3).max(80),
  targetRole: z.string().trim().max(80).optional(),
  experienceLevel: z.string().trim().max(40).optional(),
  preferredTechStack: z.string().trim().max(200).optional(),
});

const updateRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["admin", "customer"]),
});

function getAdminEmail() {
  return getServerEnv().ADMIN_EMAIL.toLowerCase();
}

function getEffectiveRole(email?: string, role?: UserRole): UserRole {
  return email?.toLowerCase() === getAdminEmail() ? "admin" : role || "customer";
}

function getErrorCode(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error
    ? String(error.code)
    : undefined;
}

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();
  const auth = getAdminAuth();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const db = getAdminDb();
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      role: getEffectiveRole(email),
      createdAt: new Date().toISOString(),
      // profileURL,
      // resumeURL,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: unknown) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (getErrorCode(error) === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const auth = getAdminAuth();
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };

    await setSessionCookie(idToken);
  } catch {
    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

export async function signInWithGoogle(params: GoogleSignInParams) {
  const { uid, name, email, idToken } = params;

  try {
    const auth = getAdminAuth();
    const db = getAdminDb();
    const decodedToken = await auth.verifyIdToken(idToken);

    if (decodedToken.uid !== uid) {
      return {
        success: false,
        message: "Google sign in failed because the token user did not match.",
      };
    }

    await db.collection("users").doc(uid).set(
      {
        name,
        email,
        role: getEffectiveRole(email),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Signed in with Google.",
    };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    const code = getErrorCode(error);

    return {
      success: false,
      message: code
        ? `Google sign in failed: ${code}`
        : "Google sign in failed. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

export async function updateUserProfile(params: UpdateUserProfileParams) {
  const parsed = updateProfileSchema.safeParse(params);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check your profile details.",
    };
  }

  const { userId, ...profile } = parsed.data;
  try {
    const db = getAdminDb();

    await db.collection("users").doc(userId).set(profile, { merge: true });
    revalidatePath("/");
    revalidatePath("/profile");

    return {
      success: true,
      message: "Profile updated.",
    };
  } catch (error) {
    console.error("Error updating profile:", error);

    return {
      success: false,
      message: "Profile update failed. Please try again.",
    };
  }
}

export async function getAllUsersForAdmin(): Promise<AdminUserRow[]> {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== "admin") {
    return [];
  }

  const db = getAdminDb();
  const users = await db.collection("users").get();

  return users.docs
    .map((doc) => {
      const data = doc.data() as Omit<AdminUserRow, "id">;
      const role = getEffectiveRole(data.email, data.role);

      return {
        ...data,
        id: doc.id,
        role,
      };
    })
    .sort((a, b) => a.email.localeCompare(b.email));
}

export async function updateUserRole(params: UpdateUserRoleParams) {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== "admin") {
    return {
      success: false,
      message: "Only admins can change roles.",
    };
  }

  const parsed = updateRoleSchema.safeParse(params);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid role update.",
    };
  }

  const db = getAdminDb();
  const userRef = db.collection("users").doc(parsed.data.userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return {
      success: false,
      message: "User not found.",
    };
  }

  const user = userDoc.data() as User;

  if (user.email?.toLowerCase() === getAdminEmail()) {
    return {
      success: false,
      message: "The primary admin role cannot be changed.",
    };
  }

  await userRef.set(
    {
      role: parsed.data.role,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  revalidatePath("/admin");

  return {
    success: true,
    message: "User role updated.",
  };
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const auth = getAdminAuth();
    const db = getAdminDb();
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    const userData = userRecord.data() as User;
    const role = getEffectiveRole(userData.email, userData.role);

    if (userData.role !== role) {
      await userRecord.ref.set({ role }, { merge: true });
    }

    return {
      ...userData,
      id: userRecord.id,
      role,
    };
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

export async function hasSessionCookie() {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get("session")?.value);
}

// Check if user is authenticated
export async function isAuthenticated() {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
}
