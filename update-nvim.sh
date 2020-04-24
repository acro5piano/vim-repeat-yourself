#!/bin/bash

export NVIM_NODE_LOG_FILE=/tmp/a.log

nvim +UpdateRemotePlugins \
    +RepeatYourselfMake \
    tests/test-project/index.js
