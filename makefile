setup-env:
	cp .env.template api/.env
	@echo "Environment file created from template. Please update .env with your actual values."

wakeup:
	cd tanstackdb && deno install && deno run dev

api-up:
	cd api && bun run src/index.ts

migrate:
	cd api && bun run db:migrate

push:
	git add . && git commit -m 'chore' && git push origin