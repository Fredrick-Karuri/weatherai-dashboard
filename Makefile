
.PHONY: dev build lint
dev:
    pnpm dev
build:
    pnpm build
lint:
    npx eslint .
