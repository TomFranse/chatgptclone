import { adminAuth, adminDb } from './firebaseAdmin';
import { Adapter, AdapterUser, AdapterAccount, AdapterSession } from 'next-auth/adapters';
import { VerificationToken } from 'next-auth/adapters';

export function CustomFirebaseAdapter(): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
      const firebaseUser = await adminAuth.createUser({
        email: user.email!,
        emailVerified: !!user.emailVerified,
        displayName: user.name || undefined,
        photoURL: user.image || undefined,
      });

      const adapterUser: AdapterUser = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        email: user.email!,
        emailVerified: user.emailVerified || new Date(),
        name: user.name || undefined,
        image: user.image || undefined,
      };

      await adminDb.collection('users').doc(firebaseUser.uid).set(adapterUser);

      return adapterUser;
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      try {
        const user = await adminAuth.getUser(id);
        return {
          id: user.uid,
          uid: user.uid,
          email: user.email!,
          emailVerified: user.emailVerified ? new Date() : null,
          name: user.displayName || undefined,
          image: user.photoURL || undefined,
        };
      } catch (error) {
        return null;
      }
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      try {
        const user = await adminAuth.getUserByEmail(email);
        return {
          id: user.uid,
          uid: user.uid,
          email: user.email!,
          emailVerified: user.emailVerified ? new Date() : null,
          name: user.displayName || undefined,
          image: user.photoURL || undefined,
        };
      } catch (error) {
        return null;
      }
    },

    async getUserByAccount({ providerAccountId, provider }): Promise<AdapterUser | null> {
      try {
        const user = await adminAuth.getUser(providerAccountId);
        return {
          id: user.uid,
          uid: user.uid,
          email: user.email!,
          emailVerified: user.emailVerified ? new Date() : null,
          name: user.displayName || undefined,
          image: user.photoURL || undefined,
        };
      } catch {
        return null;
      }
    },

    async updateUser(user: Partial<AdapterUser> & { id: string }): Promise<AdapterUser> {
      const { id, ...updates } = user;
      await adminAuth.updateUser(id, {
        ...updates,
        emailVerified: updates.emailVerified ? true : undefined,
      });
      const updatedUser = await adminAuth.getUser(id);
      
      return {
        id: updatedUser.uid,
        uid: updatedUser.uid,
        email: updatedUser.email!,
        emailVerified: updatedUser.emailVerified ? new Date() : null,
        name: updatedUser.displayName || undefined,
        image: updatedUser.photoURL || undefined,
      };
    },

    async linkAccount(account: AdapterAccount): Promise<AdapterAccount> {
      await adminDb.collection('users').doc(account.userId)
        .collection('accounts').doc(account.provider).set(account);
      return account;
    },

    async unlinkAccount(
      account: Pick<AdapterAccount, "provider" | "providerAccountId">
    ): Promise<void> {
      // Implementation depends on your needs
    },

    async deleteUser(userId: string) {
      await adminAuth.deleteUser(userId);
      await adminDb.collection('users').doc(userId).delete();
    },

    // Session and verification token methods
    async createSession(session: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }): Promise<AdapterSession> {
      return {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
      };
    },

    async getSessionAndUser(sessionToken: string): Promise<{
      session: AdapterSession;
      user: AdapterUser;
    } | null> {
      return null; // Implement if needed
    },

    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ): Promise<AdapterSession | null> {
      return null; // Implement if needed
    },

    async deleteSession(sessionToken: string): Promise<void> {
      // Implement if needed
    },

    async createVerificationToken(
      verificationToken: VerificationToken
    ): Promise<VerificationToken | null> {
      return null; // Implement if needed
    },

    async useVerificationToken(params: {
      identifier: string;
      token: string;
    }): Promise<VerificationToken | null> {
      return null; // Implement if needed
    },
  };
}