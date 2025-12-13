import { spawn } from 'node:child_process'
import type { Plugin } from 'vite'

export function tailwindWatch(): Plugin {
	let tailwindProcess: ReturnType<typeof spawn> | null = null

	return {
		name: 'tailwind-watch',
		apply: 'serve', // 開発モードでのみ動作
		buildStart() {
			if (tailwindProcess) {
				return
			}

			// 初回ビルド
			const initialBuild = spawn(
				'npx',
				[
					'@tailwindcss/cli',
					'-i',
					'./src/styles/input.css',
					'-o',
					'./public/styles.css',
				],
				{
					stdio: 'inherit',
					shell: true,
				}
			)

			initialBuild.on('close', (code) => {
				if (code !== 0) {
					console.error('Tailwind CSS initial build failed')
					return
				}

				// 初回ビルド後にwatchモードで起動
				tailwindProcess = spawn(
					'npx',
					[
						'@tailwindcss/cli',
						'-i',
						'./src/styles/input.css',
						'-o',
						'./public/styles.css',
						'--watch',
					],
					{
						stdio: 'inherit',
						shell: true,
					}
				)

				tailwindProcess.on('error', (error) => {
					console.error('Tailwind CSS watch error:', error)
				})
			})
		},
		buildEnd() {
			if (tailwindProcess) {
				tailwindProcess.kill()
				tailwindProcess = null
			}
		},
	}
}

