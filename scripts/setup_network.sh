#!/bin/bash

export PROGRAM_ROOT=/root/encrypto/
export TEST_NETWORK_ROOT=$PROGRAM_ROOT/fabric-samples/test-network

cd $TEST_NETWORK_ROOT

# bash network.sh up createChannel -ca -c mychannel -s couchdb

bash network.sh up createChannel
sleep 1
bash network.sh deployCC -ccn encrypto -ccp /root/encrypto/chaincode/encrypto-go/ -ccl go
