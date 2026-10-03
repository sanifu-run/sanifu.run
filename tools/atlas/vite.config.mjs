import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],base:'/atlas/',build:{outDir:'../../atlas',emptyOutDir:true}});
