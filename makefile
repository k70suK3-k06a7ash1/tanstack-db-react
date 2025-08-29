wakeup:
	cd tanstackdb && deno install && deno run dev

push:
	git add . && git commit -m 'chore' && git push origin