# VHS Tape: Buffer Navigation
# Run: vhs tapes/buffer-nav.tape

Output gifs/buffer-nav.gif

Set Shell "zsh"
Set FontSize 14
Set Width 1200
Set Height 600
Set Theme "Kanagawa Dragon"

# Open nvim with multiple files
Type "nvim ~/.config/nvim/lua/options.lua ~/.config/nvim/lua/lsp.lua ~/.config/nvim/lua/lazyconfig.lua"
Enter
Sleep 1s

# Navigate buffers with Shift-L
Type "L"
Sleep 1s

Type "L"
Sleep 1s

# Navigate back with Shift-H
Type "H"
Sleep 1s

Type "H"
Sleep 1s

Sleep 1s
