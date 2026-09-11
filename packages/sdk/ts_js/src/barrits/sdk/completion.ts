/**
 * @module
 * [EN] Shell completion scripts (bash, zsh, fish) generated from the same constants the CLI parser validates
 * against, so completions can never advertise values the CLI rejects.
 * [ES] Scripts de completado de shell (bash, zsh, fish) generados a partir de las mismas constantes que valida el
 * parser de la CLI, de modo que el completado nunca ofrezca valores que la CLI rechaza.
 */
import { CLI_COMMANDS, CLI_COMMAND_DESCRIPTIONS } from "./cli-parser";
import { BARRITS_EXPORT_VISIBILITIES, BARRITS_FILE_KINDS } from "./guards";
import { IMPORT_ACTION_KINDS } from "./validation";

const BARRITS_OPTIONS = [
  "--json",
  "--write",
  "--write-snapshot",
  "--target",
  "--snapshot",
  "--domain",
  "--export",
  "--kind",
  "--file-kind",
  "--visibility",
  "--mode",
  "--help",
] as const;

const COMMAND_WORDS = CLI_COMMANDS.join(" ");
const IMPORT_KIND_WORDS = Array.from(IMPORT_ACTION_KINDS).join(" ");
const FILE_KIND_WORDS = BARRITS_FILE_KINDS.join(" ");
const VISIBILITY_WORDS = BARRITS_EXPORT_VISIBILITIES.join(" ");
const SHELL_WORDS = "bash zsh fish";

const generateBashCompletion = (): string => `_barrits_completion() {
  local cur prev
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"

  if [[ $COMP_CWORD -eq 1 ]]; then
    COMPREPLY=($(compgen -W "${COMMAND_WORDS}" -- "$cur"))
    return 0
  fi

  case $prev in
    --domain|--export|--target|--snapshot)
      return 0
      ;;
    --kind|--mode)
      COMPREPLY=($(compgen -W "${IMPORT_KIND_WORDS}" -- "$cur"))
      return 0
      ;;
    --file-kind)
      COMPREPLY=($(compgen -W "${FILE_KIND_WORDS}" -- "$cur"))
      return 0
      ;;
    --visibility)
      COMPREPLY=($(compgen -W "${VISIBILITY_WORDS}" -- "$cur"))
      return 0
      ;;
    completion)
      COMPREPLY=($(compgen -W "${SHELL_WORDS}" -- "$cur"))
      return 0
      ;;
  esac

  COMPREPLY=($(compgen -W "${BARRITS_OPTIONS.join(" ")}" -- "$cur"))
  return 0
}

complete -F _barrits_completion barrits brt
`;

const generateZshCompletion = (): string => `#compdef barrits brt

_barrits_commands() {
  local -a commands
  commands=(
    ${CLI_COMMANDS.map((command) => `"${command}:${CLI_COMMAND_DESCRIPTIONS[command]}"`).join("\n    ")}
  )
  _describe 'command' commands
}

_barrits() {
  local context state state_descr line
  typeset -A opt_args

  _arguments -C \\
    '1: :->command' \\
    '*:: :->args'

  case $state in
    command)
      _barrits_commands
      ;;
    args)
      case $words[1] in
        detect|info|watch|dev|build)
          _arguments \\
            '--json[Output as JSON]' \\
            '--domain[Filter by domain]:domain' \\
            '--export[Filter by export]:export' \\
            '--file-kind[Filter by file kind]:kind:(${FILE_KIND_WORDS})' \\
            '--visibility[Filter by visibility]:visibility:(${VISIBILITY_WORDS})' \\
            '--kind[Filter by import kind]:kind:(${IMPORT_KIND_WORDS})' \\
            '--write-snapshot[Write snapshot file]' \\
            '--snapshot[Snapshot file path]:snapshot:_files' \\
            '--help[Show help]'
          ;;
        imports)
          _arguments \\
            '--json[Output as JSON]' \\
            '--write[Write imports to disk]' \\
            '--target[Target file]:target:_files' \\
            '--mode[Import mode]:mode:(${IMPORT_KIND_WORDS})' \\
            '--domain[Filter by domain]:domain' \\
            '--export[Filter by export]:export' \\
            '--kind[Filter by kind]:kind:(${IMPORT_KIND_WORDS})' \\
            '--help[Show help]'
          ;;
        completion)
          _arguments '1:shell:(${SHELL_WORDS})'
          ;;
      esac
      ;;
  esac
}

compdef _barrits barrits brt
`;

const generateFishCompletion = (): string => `complete -c barrits -f -n '__fish_use_subcommand' -a '${CLI_COMMANDS.join("' '")}'
complete -c brt -f -n '__fish_use_subcommand' -a '${CLI_COMMANDS.join("' '")}'

${CLI_COMMANDS.filter((command) => command !== "help" && command !== "completion")
  .map(
    (command) => `# ${command} options
complete -c barrits -n '__fish_seen_subcommand_from ${command}' -l json -d 'Output as JSON'
complete -c barrits -n '__fish_seen_subcommand_from ${command}' -l domain -d 'Filter by domain' -r
complete -c barrits -n '__fish_seen_subcommand_from ${command}' -l export -d 'Filter by export' -r
complete -c barrits -n '__fish_seen_subcommand_from ${command}' -l file-kind -d 'Filter by file kind' -r -f -a '${FILE_KIND_WORDS}'
complete -c barrits -n '__fish_seen_subcommand_from ${command}' -l visibility -d 'Filter by visibility' -r -f -a '${VISIBILITY_WORDS}'
complete -c barrits -n '__fish_seen_subcommand_from ${command}' -l kind -d 'Filter by import kind' -r -f -a '${IMPORT_KIND_WORDS}'
complete -c barrits -n '__fish_seen_subcommand_from ${command}' -l help -d 'Show help'
`,
  )
  .join("\n")}
# imports specific
complete -c barrits -n '__fish_seen_subcommand_from imports' -l write -d 'Write imports to disk'
complete -c barrits -n '__fish_seen_subcommand_from imports' -l target -d 'Target file' -r
complete -c barrits -n '__fish_seen_subcommand_from imports' -l mode -d 'Import mode' -r -f -a '${IMPORT_KIND_WORDS}'

# watch/dev specific
complete -c barrits -n '__fish_seen_subcommand_from watch dev' -l write-snapshot -d 'Write snapshot file'
complete -c barrits -n '__fish_seen_subcommand_from watch dev' -l snapshot -d 'Snapshot file path' -r

# completion specific
complete -c barrits -n '__fish_seen_subcommand_from completion' -f -a '${SHELL_WORDS}'
`;

/**
 * [EN] Generates a shell completion script (bash/zsh/fish) for the Barrits CLI.
 * [ES] Genera un script de completado de shell (bash/zsh/fish) para la CLI de Barrits.
 */
export const generateCompletionScript = (shell: string): string => {
  switch (shell) {
    case "bash": {
      return generateBashCompletion();
    }
    case "zsh": {
      return generateZshCompletion();
    }
    case "fish": {
      return generateFishCompletion();
    }
    default: {
      return `Supported shells: bash, zsh, fish. Usage: barrits completion <shell>\n`;
    }
  }
};

/**
 * [EN] Prints a shell completion script for the given shell to stdout.
 * [ES] Imprime un script de completado de shell para el shell indicado en stdout.
 */
export const printCompletion = (shell: string): void => {
  console.log(generateCompletionScript(shell));
};
