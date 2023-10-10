#!/bin/bash
curl ~/install-talisman.sh
echo "Copies Talisman pre-commit hook to .git folder"
file='.git/hooks/pre-commit'
gitFolder='.git'
if [ ! -f $gitFolder ] 
then 
    echo 'git not initialised'

elif [ ! -f $file ] && [ -z $GITHUB_ACTIONS ]
then
    echo 'No Talisman hook available. Setting up the hook now..'
    echo 'Copying Talisman pre-commit hook to your git hooks'
    curl https://thoughtworks.github.io/talisman/install.sh > ~/install-talisman.sh
    chmod +x ~/install-talisman.sh

    ~/install-talisman.sh pre-commit

else
    echo 'A pre-commit hook already exists or running on CI. Ensure Talisman check is also part of your pre-commit hook'
fi
