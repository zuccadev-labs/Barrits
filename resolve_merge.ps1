git merge origin/dev

$conflicts = git diff --name-only --diff-filter=U

foreach ($file in $conflicts) {
    if ($file -match '\.d\.ts$') {
        git checkout --ours $file
        git add $file
    }
    elseif ($file -match '\.md$') {
        git checkout --ours $file
        git add $file
    }
}
