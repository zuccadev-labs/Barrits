use std::fs;
use std::path::{Component, PathBuf};

fn ensure_allowed_relative_path(relative_path: &str) -> Result<PathBuf, String> {
    let candidate = PathBuf::from(relative_path);

    if candidate.is_absolute() {
        return Err("Absolute paths are not allowed.".into());
    }

    for component in candidate.components() {
        if matches!(component, Component::ParentDir | Component::Prefix(_)) {
            return Err("Path traversal is not allowed.".into());
        }
    }

    let allowed_root = candidate
        .components()
        .next()
        .and_then(|component| match component {
            Component::Normal(value) => value.to_str(),
            _ => None,
        })
        .ok_or_else(|| "The path must point to a file under .cache or .barrits.".to_string())?;

    if allowed_root != ".cache" && allowed_root != ".barrits" {
        return Err("Only .cache/** or .barrits/** paths are allowed.".into());
    }

    Ok(candidate)
}

#[tauri::command]
fn read_allowed_text_file(relative_path: String) -> Result<String, String> {
    let safe_relative_path = ensure_allowed_relative_path(&relative_path)?;
    let base_directory = std::env::current_dir().map_err(|error| error.to_string())?;
    let resolved_path = base_directory.join(safe_relative_path);

    fs::read_to_string(resolved_path).map_err(|error| error.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_allowed_text_file])
        .run(tauri::generate_context!())
        .expect("error while running barrits tauri example");
}