"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [user, setUser] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }
  const signUp = async (email, password, nick,fullname) => {
    const user = await supabase.auth.signUp({
      email,
      password,
    });
    if (user.error) {
      console.error("Error en registro:", user.error.message);
      return null;
    }
    if (user.data.user) {
      const data = await supabase
        .from('profiles')
        .insert([{ id: user.data.user.id, nick,fullname }]);
      if (data.error) {
        console.error("Error creando perfil:", data.error.message);
        return null;
      }
      return { user, data };
    }
    else {
      console.log("error")
    }
  };
  const signOut = () => supabase.auth.signOut();

  return {
    user,
    signIn,
    signUp,
    signOut,
  };
}
