const BARRITS_COMMANDS = ["detect", "info", "watch", "dev", "imports", "build", "help", "completion"] as const;

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

const BARRITS_KINDS = ["named-import", "namespace-access", "alias-namespace-access"] as const;

const generateBashCompletion = (): string => `_barrits_completion() {
  local cur prev
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"

  if [[ $COMP_CWORD -eq 1 ]]; then
    COMPREPLY=($(compgen -W "${BARRITS_COMMANDS.join(" ")}" -- "$cur"))
    return 0
  fi

  case $prev in
    --domain|--export|--target|--snapshot)
      return 0
      ;;
    --kind|--mode)
      COMPREPLY=($(compgen -W "${BARRITS_KINDS.join(" ")}" -- "$cur"))
      return 0
      ;;
    --file-kind)
      COMPREPLY=($(compgen -W "source barrel config" -- "$cur"))
      return 0
      ;;
    --visibility)
      COMPREPLY=($(compgen -W "public internal" -- "$cur"))
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
    ${BARRITS_COMMANDS.map((c) => `"${c}:${getCommandDescription(c)}"`).join("\n    ")}
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
            '--file-kind[Filter by file kind]:kind:(source barrel config)' \\
            '--visibility[Filter by visibility]:visibility:(public internal)' \\
            '--kind[Filter by import kind]:kind:(${BARRITS_KINDS.join(" ")})' \\
            '--help[Show help]'
          ;;
        imports)
          _arguments \\
            '--json[Output as JSON]' \\
            '--write[Write imports to disk]' \\
            '--target[Target file]:target:_files' \\
            '--mode[Import mode]:mode:(${BARRITS_KINDS.join(" ")})' \\
            '--domain[Filter by domain]:domain' \\
            '--export[Filter by export]:export' \\
            '--kind[Filter by kind]:kind:(${BARRITS_KINDS.join(" ")})' \\
            '--help[Show help]'
          ;;
        help|completion)
          case $words[1] in
            completion)
              _arguments '1:shell:(bash zsh fish)'
              ;;
          esac
          ;;
      esac
      ;;
  esac
}

_compdef _barrits barrits brt
`;

const generateFishCompletion = (): string => `complete -c barrits -f -n '__fish_use_subcommand' -a '${BARRITS_COMMANDS.join("' '")}'
complete -c brt -f -n '__fish_use_subcommand' -a '${BARRITS_COMMANDS.join("' '")}'

${BARRITS_COMMANDS.filter((c) => c !== "help" && c !== "completion").map(
  (cmd) => `# ${cmd} options
complete -c barrits -n '__fish_seen_subcommand_from ${cmd}' -l json -d 'Output as JSON'
complete -c barrits -n '__fish_seen_subcommand_from ${cmd}' -l domain -d 'Filter by domain' -r
complete -c barrits -n '__fish_seen_subcommand_from ${cmd}' -l export -d 'Filter by export' -r
complete -c barrits -n '__fish_seen_subcommand_from ${cmd}' -l file-kind -d 'Filter by file kind' -r -f -a 'source barrel config'
complete -c barrits -n '__fish_seen_subcommand_from ${cmd}' -l visibility -d 'Filter by visibility' -r -f -a 'public internal'
complete -c barrits -n '__fish_seen_subcommand_from ${cmd}' -l help -d 'Show help'
`,
).join("\n")}
# imports specific
complete -c barrits -n '__fish_seen_subcommand_from imports' -l write -d 'Write imports to disk'
complete -c barrits -n '__fish_seen_subcommand_from imports' -l target -d 'Target file' -r
complete -c barrits -n '__fish_seen_subcommand_from imports' -l mode -d 'Import mode' -r -f -a '${BARRITS_KINDS.join(" ")}'

# watch/dev specific
complete -c barrits -n '__fish_seen_subcommand_from watch dev' -l write-snapshot -d 'Write snapshot file'
complete -c barrits -n '__fish_seen_subcommand_from watch dev' -l snapshot -d 'Snapshot file path' -r

# completion specific
complete -c barrits -n '__fish_seen_subcommand_from completion' -f -a 'bash zsh fish'
`;

const getCommandDescription = (command: string): string => {
  const descriptions: Record<string, string> = {
    detect: "Detect barrits directory and integrations",
    info: "Show integration graph overview",
    watch: "Watch barrits directory for changes",
    dev: "Start dev session with child process",
    imports: "Generate and manage import actions",
    build: "Generate build manifest",
    help: "Show help text",
    completion: "Generate shell completion script",
  };
  return descriptions[command] ?? "";
};

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

export const printCompletion = (shell: string): void => {
  console.log(generateCompletionScript(shell));
};
