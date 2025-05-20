// git rev-parse --is-inside-work-tree

// # Check current branch and status
// git status

// # List all branches
// git branch -a

// # Show remote repository information
// git remote -v

// # Show commit history
// git log --oneline --graph --decorate -n 5

// # Extract GitHub repository details from remote URL
// git remote get-url origin

// #!/bin/bash

// echo "Checking Git status..."

// # Check if directory is a git repository
// if git rev-parse --is-inside-work-tree &>/dev/null; then
//     echo "✅ Git is initialized in this directory"

//     echo -e "\n📂 Current branch and status:"
//     git status -s -b

//     echo -e "\n🔗 Remote repository information:"
//     if remote_info=$(git remote -v); then
//         echo "$remote_info"

//         # Check if connected to GitHub
//         if echo "$remote_info" | grep -q "github.com"; then
//             echo -e "\n🐙 GitHub repository detected:"
//             repo_url=$(git remote get-url origin)
//             echo "$repo_url"

//             # Extract username and repo name from GitHub URL
//             if [[ $repo_url == *"github.com"* ]]; then
//                 repo_path=$(echo $repo_url | sed -E 's/.*github.com[:/](.+)(\.git)?/\1/')
//                 echo "Repository path: $repo_path"
//             fi
//         else
//             echo -e "\n❌ Not connected to a GitHub repository"
//         fi
//     else
//         echo "No remote repositories configured"
//     fi
// else
//     echo "❌ This directory is not a Git repository"
// fi
