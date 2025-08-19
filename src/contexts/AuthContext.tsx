import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Authentication features will be disabled.');
      setLoading(false);
      return;
    }

    // Clear invalid tokens on startup
    const clearInvalidTokens = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error && error.message.includes('refresh_token_not_found')) {
          console.log('🧹 Clearing invalid tokens...');
          await supabase.auth.signOut();
          localStorage.clear();
        }
      } catch (error) {
        console.log('🧹 Clearing storage due to auth error...');
        localStorage.clear();
      }
    };

    clearInvalidTokens();

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
      setLoading(false);
    }).catch((error) => {
      console.error('Error getting session:', error);
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.log('🧹 Token refresh failed, clearing storage...');
        localStorage.clear();
      }
      
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    if (!isSupabaseConfigured()) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Erro ao verificar status admin:', error);
        setIsAdmin(false);
        return;
      }

      if (data) {
        setIsAdmin(true);
      } else {
        // Se não existe registro de admin, criar automaticamente para o primeiro usuário
        await createAdminUser(userId);
      }
    } catch (error) {
      console.error('Erro na verificação de admin:', error);
      setIsAdmin(false);
    }
  };

  const createAdminUser = async (userId: string) => {
    if (!isSupabaseConfigured()) {
      return;
    }

    try {
      // Verificar se já existe algum admin
      const { count } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true });

      // Se não existe nenhum admin, criar o primeiro
      if (count === 0) {
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData.user) {
          const { error } = await supabase
            .from('admin_users')
            .insert({
              user_id: userId,
              email: userData.user.email,
              full_name: userData.user.email?.split('@')[0] || 'Admin',
              role: 'admin',
              is_active: true
            });

          if (!error) {
            console.log('✅ Usuário admin criado automaticamente');
            setIsAdmin(true);
          } else {
            console.error('❌ Erro ao criar usuário admin:', error);
            setIsAdmin(false);
          }
        }
      } else {
        console.log('⚠️ Já existem admins no sistema. Contate um administrador.');
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Erro ao criar admin:', error);
      setIsAdmin(false);
    }
  };
  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    console.log('🔄 Fazendo login no Supabase...');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('❌ Erro de autenticação:', error);
      throw error;
    }
    console.log('✅ Autenticação realizada com sucesso');
  };

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    isAdmin,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};