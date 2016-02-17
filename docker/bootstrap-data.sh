#!/bin/bash
set -e
set -x

echo "IN BOOTSTRAP DATA"

(

# Parse input parameters...
#
# See if we're pulling latest data no matter what, ignoring cache.
# Default = N
GET_LATEST_DATA=${1:-N}


# Hard code some other vars important for bootstrapping
#
bootstrap_data_branch=master


# Move to API folder for relative path assumptions later on
#
cd /var/scitran/code/api

# Export PYTHONPATH for python script later on.
#
export PYTHONPATH=.


# Bootstrap data

# Compare hash of source test data to most recent download. Remove local copy to force re-download if they are different.
TESTDATA_URL="https://github.com/scitran/testdata/archive/${bootstrap_data_branch}.tar.gz"
TESTDATA_VERSION=$(curl -sLI ${TESTDATA_URL} | grep ETag | tail -n 1 | cut -f 2 -d '"')

# use hidden
TESTDATA_DIR=$SCITRAN_PERSISTENT_PATH/testdata

if [ ! -d "$TESTDATA_DIR" ] || [ ! -d "$TESTDATA_DIR/download" ] || [ ! -f "$TESTDATA_DIR/.testdata_version" ]; then
    echo "Downloading testdata to $TESTDATA_DIR"
    mkdir -p "$TESTDATA_DIR/download"
    curl -L $TESTDATA_URL | tar xz -C "$TESTDATA_DIR/download" --strip-components 1
else
    if [ "$TESTDATA_VERSION" != "$(cat $TESTDATA_DIR/.testdata_version)" ]; then
        echo "Testdata out of date; downloading"
        curl -L $TESTDATA_URL | tar xz -C "$TESTDATA_DIR/download" --strip-components 1
    else
        echo "Testdata up to date"
    fi
fi
builtin echo "$TESTDATA_VERSION" > "$TESTDATA_DIR/.testdata_version"


## load the test data in
./bin/bootstrap.py data --copy $TESTDATA_DIR/download

)