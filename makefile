wakeup:
	cd tanstackdb && deno install && deno run dev

api-up:
	cd api && bun run src/index.ts

push:
	git add . && git commit -m 'chore' && git push origin