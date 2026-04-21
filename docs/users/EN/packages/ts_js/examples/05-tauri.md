# 05 Desktop Integration (Tauri)

The Tauri example demonstrates how to build secure, cross-platform desktop applications using Barrits to bridge the gap between the Rust/Node backend and the web-based frontend.

## Key Features

- **Security Isolation**: The example enforces strictly allowed path restrictions for the `.cache` and `.barrits` directories.
- **Frontend/Backend Parity**: Both the Tauri backend (Node-based sidecar) and the UI (React/Vite) consume the same discovery manifest.
- **Path Traversal Protection**: Integration logic validates paths to prevent unauthorized access to the host filesystem.

## Architecture

The Tauri implementation shows how to:
1.  Run the Barrits orchestrator within the Tauri sidecar.
2.  Expose the discovered domain graph to the frontend securely.
3.  Use the generated artifacts to drive the desktop app's reactive UI.
