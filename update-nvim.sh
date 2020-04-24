#!/bin/bash

nvim +UpdateRemotePlugins \
    +RepeatYourselfMake \
    +RepeatYourselfImport \
    tests/test-project/index.js
