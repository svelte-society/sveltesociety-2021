# sveltesociety.dev

This branch contains the upcoming Svelte Society website featuring a new design and data that lives in a database.

## Developing

To start off, clone and run `pnpm i`

Add all the relevant .env variables:

```
PUBLIC_API_URL=

// For Type gen
PB_TYPEGEN_URL=
PB_TYPEGEN_EMAIL=
PB_TYPEGEN_PASSWORD=
```

To pull down new types use `pnpm gen:types`.