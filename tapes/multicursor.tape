# VHS Tape: Multicursor Visual Block
# Run: vhs tapes/multicursor.tape

Output gifs/multicursor.gif

Set Shell "zsh"
Set FontSize 14
Set Width 1200
Set Height 600
Set Theme "Kanagawa Dragon"

# Create a sample file to demonstrate
Type "nvim /tmp/multicursor-demo.txt"
Enter
Sleep 500ms

# Enter insert mode and type some lines
Type "iapple"
Enter
Type "banana"
Enter
Type "cherry"
Enter
Type "durian"
Escape
Sleep 500ms

# Go to top of file
Type "gg"
Sleep 300ms

# Go to beginning of line
Type "0"
Sleep 300ms

# Enter visual block mode
Ctrl+v
Sleep 300ms

# Select down 3 lines
Type "3j"
Sleep 500ms

# Insert at beginning with multicursor
Type "I"
Sleep 300ms

# Type prefix
Type "fruit: "
Sleep 500ms

# Exit to see result
Escape
Sleep 2s
