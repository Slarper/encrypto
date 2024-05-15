#!/bin/bash

export SCRIPTS_ROOT=/root/encrypto/scripts
source $SCRIPTS_ROOT/p0o1.sh

export ORDERER_CA=$TEST_NETWORK_ROOT/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export P0O1_CA=$TEST_NETWORK_ROOT/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export P0O2_CA=$TEST_NETWORK_ROOT/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

export CC_NAME=encrypto

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "$ORDERER_CA" -C mychannel -n "$CC_NAME" --peerAddresses localhost:7051 --tlsRootCertFiles "$P0O1_CA" --peerAddresses localhost:9051 --tlsRootCertFiles "$P0O2_CA" -c '{"function":"InitLedger","Args":[]}'

