#!/bin/bash

echo ">>>>>>>>> Copies Talisman pre-commit and pre-push hooks to .git folder"
preCommitFile='.git/hooks/pre-commit'
prePushFile='.git/hooks/pre-push'
gitFolder='.git'

if [ ! -d $gitFolder ]
then
    echo 'git not initialized'
else
    if [ -f $preCommitFile ] && [ -z $GITHUB_ACTIONS ]
    then
        echo '>>>>>>> Removing existing pre-commit hook...'
        rm $preCommitFile
        echo '>>>>>>> Existing pre-commit hook removed.'
    fi

    if [ -f $prePushFile ] && [ -z $GITHUB_ACTIONS ]
    then
        echo '>>>>>>> Removing existing pre-push hook...'
        rm $prePushFile
        echo '>>>>>>> Existing pre-push hook removed.'
    fi

    if [ ! -f $preCommitFile ] && [ -z $GITHUB_ACTIONS ]
    then
        echo '>>>>>>> No Talisman pre-commit hook available. Setting up the hook now..'
        echo '>>>>>>> Copying Talisman pre-commit hook to your git hooks'
        curl https://thoughtworks.github.io/talisman/install.sh > ~/install-talisman.sh
        chmod +x ~/install-talisman.sh
        ~/install-talisman.sh pre-commit
    fi

    if [ ! -f $prePushFile ] && [ -z $GITHUB_ACTIONS ]
    then
        echo '>>>>>>> No Talisman pre-push hook available. Setting up the hook now..'
        echo '>>>>>>> Copying Talisman pre-push hook to your git hooks'
        curl https://thoughtworks.github.io/talisman/install.sh > ~/install-talisman.sh
        chmod +x ~/install-talisman.sh
        ~/install-talisman.sh pre-push
    fi
fi
