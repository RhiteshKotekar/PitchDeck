# Contributing

Contributions are welcome. Before opening a pull request:

1. Keep route files in `src/app/` limited to screens and layouts; put shared code elsewhere in `src/`.
2. Keep backend changes under `server/` and add or update database migrations when the schema changes.
3. Do not commit credentials, local environment files, generated native directories, or build output.
4. Describe the change and any setup or migration steps in the pull request.
5. Run the relevant checks from the repository root:

```sh
npx expo lint
npx tsc --noEmit
npm --prefix server run build
npm --prefix server test
```

For API changes, update [the API reference](api.md). For setup changes, update [the getting started guide](getting-started.md).

## License

Check the repository's `LICENSE` file before redistributing changes. The current file contains Expo's copyright notice; the project owner should replace it with the license and copyright notice intended for LaunchDeck before inviting public contributions.
