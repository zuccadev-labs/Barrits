# 01 Publication and channels

The distribution strategy for `barrits` relies on two primary public channels that ensure full coverage of the current integration scenarios.

## Coverage by Distribution Channel

- **npm Registry**: Provides support for Node.js environments and bundler-based workflows, covering integrations for React, Vue, Solid, Svelte, and desktop applications via Tauri.
- **JSR Registry**: Supplies a native surface for Deno environments, ensuring SDK portability through the `jsr.json` specification.

## Technical Justification for Channel Selection

The combination of npm and JSR is sufficient for the organization's current objectives due to the following reasons:

- Frontend and bundling implementations operate natively on the Node.js ecosystem (Vite, esbuild, Rollup, Webpack).
- Desktop application support (Tauri) depends directly on local Node.js ecosystem tooling.
- The Deno environment requires an optimized export surface compatible with JSR to ensure a seamless development experience.

## Operational Conclusion

It is determined that the current scope of npm and JSR covers all visible paths in the existing integration examples. The addition of further public channels is not considered necessary for redundancy. Should private or corporate distribution be required, priority will be given to internal registries or mirrors over additional external channels.

## Future Expansion Scenarios

Alternative options will be evaluated only in response to specific technical or governance requirements:

- **GitHub Packages**: As an internal corporate control channel or mirror.
- **Private Registries**: Implementation of Artifactory or Verdaccio for secure internal distribution.
- **Prerelease Channels**: Formalization of "canary" or beta version flows within existing registries.
