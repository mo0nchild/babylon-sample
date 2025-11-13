import { defineConfig, type AliasOptions } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const pathAlias: AliasOptions = [
  	{
		find: "@components",
		replacement: path.resolve(__dirname, "src/components"),
	},
	{
		find: "@types",
		replacement: path.resolve(__dirname, "src/types"),
	},
	{
		find: "@contexts",
		replacement: path.resolve(__dirname, "src/contexts"),
	},
]

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  resolve: {
    alias: pathAlias
  }
})
