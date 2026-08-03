// ============================================================
// firebase.js — Configuração e inicialização do Firebase
// Projeto: Mikami Sushi (mesmo projeto usado pelo painel admin)
// Usado aqui apenas para ler o status "site aberto/fechado".
// ============================================================
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2NZjr6ACdBhTE8yqy2LJpqituUnHChb4",
  authDomain: "mikami-sushi.firebaseapp.com",
  projectId: "mikami-sushi",
  storageBucket: "mikami-sushi.firebasestorage.app",
  messagingSenderId: "1008214343375",
  appId: "1:1008214343375:web:bbb7cdd7cbc7aa393641ba"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
