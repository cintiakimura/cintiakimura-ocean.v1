
// This is a mock Supabase client file as requested for the skeleton.
// In a real application, you would initialize the Supabase client here
// using environment variables.

// Mock functions to simulate Supabase Auth API
export const auth = {
  signUp: async ({ email, password }: any) => {
    console.log(`Mock sign up with ${email}`);
    await new Promise(res => setTimeout(res, 500));
    return { user: { id: '123', email }, session: { access_token: 'fake-token' }, error: null };
  },
  signInWithPassword: async ({ email, password }: any) => {
    console.log(`Mock sign in with ${email}`);
    await new Promise(res => setTimeout(res, 500));
    return { user: { id: '123', email }, session: { access_token: 'fake-token' }, error: null };
  },
  signOut: async () => {
    console.log('Mock sign out');
    await new Promise(res => setTimeout(res, 200));
    return { error: null };
  },
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    console.log('Mock onAuthStateChange listener attached.');
    setTimeout(() => callback('INITIAL_SESSION', null), 100);
    const unsubscribe = () => console.log('Mock auth listener unsubscribed.');
    return { data: { subscription: { unsubscribe } } };
  },
};

export const supabase = { auth };
